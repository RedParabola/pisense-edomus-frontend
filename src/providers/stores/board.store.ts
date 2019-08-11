// Basic
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

// Api Services
import { BoardDatabaseService } from '../db/board.service.db';
import { ApiBoardProvider } from '../api/api-board.service';

// Services
import { AuthService } from '../services/auth.service';
import { NetworkService } from '../services/network.service';
import { LoggerService } from '../services/logger.service'

// Models
import { BoardModel } from '../../core/model/board.model';

/**
 * Store to handle boards.
 */
@Injectable()
export class BoardStore {

  /**
   * Observer to know if the board list changes.
   */
  private _currentBoardsObservable: BehaviorSubject<BoardModel[]>

  /**
   * current board list.
   */
  private _currentBoards: BoardModel[]

  /**
   * Subscription to network status.
   */
  private _networkSubscription: Subscription;

  /**
   * Observer to know if the board list changes.
   */
  private _detectedUsbBoardObservable: BehaviorSubject<BoardModel>

  /**
   * currently detected board connected to USB.
   */
  private _detectedUsbBoard: BoardModel;

  /**
   * no board status.
   */
  private _noBoard: BoardModel;

  /**
   * 
   */
  private _pollingUsbInterval: any;

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param boardDB Board database service
   * @param boardProvider Api board provider
   * @param authService Service to provide authentication
   * @param networkService Network service
   * @param loggerService logger service
   */
  constructor(private boardDB: BoardDatabaseService, private boardProvider: ApiBoardProvider, public auth: AuthService, private networkService: NetworkService, private loggerService: LoggerService) {
    this._currentBoardsObservable = new BehaviorSubject<BoardModel[]>([]);
    this._noBoard = {} as BoardModel;
    this._detectedUsbBoardObservable = new BehaviorSubject<BoardModel>(this._noBoard);
    this._currentBoards = [];
    this._detectedUsbBoard = null;
    this._pollingUsbInterval = null;
    this._networkSubscription = null;
  }

  public listenAuthenticationStatus(): void {
    this.auth.authenticationObserver().subscribe((status: boolean) => {
      if (status) {
        this._networkSubscription = this.networkService.onlineObserver().subscribe((isOnline) => {
          if (isOnline) this._synchronizeData();
        });
      } else if (this._networkSubscription) {
        this._networkSubscription.unsubscribe();
      }
    });
  }

  /**
   * when online, synchronize data with the remote changes in boards
   */
  private _synchronizeData(): void {
    const promiseArray: Promise<any>[] = [];
    // Get all boards from remote service
    this.boardProvider.getAllBoards().then((boards: BoardModel[]) => {
      // Save each board into the DB
      boards.forEach(board => promiseArray.push(this.boardDB.set(board.id, board)));
      Promise.all(promiseArray).then(
        () => this.refreshList(),
        (error) => this.loggerService.error(this, `FAILED Set Board into DB.`, error));
    }, (error) => this.loggerService.error(this, `FAILED Get All Boards from API.`, error));
  }

  /**
   * Retrieve the last DB values and set it as the current boards
   */
  private refreshList(): Promise<any> {
    return this.boardDB.getAll().then((boards: BoardModel[]) => {
      this._currentBoards = boards;
      this._currentBoardsObservable.next(this._currentBoards);
    }, (error) => {
      this.loggerService.error(this, `FAILED Get All Boards from DB.`, error);
    });
  }

  /**
   * Method to know if the board list changes and retrieve it.
   */
  public boardsChange(): Observable<BoardModel[]> {
    return this._currentBoardsObservable.asObservable().share();
  }

  /**
   * Method to know if the usb detected board changes and retrieve it.
   */
  public detectedBoardObserver(): Observable<BoardModel> {
    return this._detectedUsbBoardObservable.asObservable().share();
  }

  public startPollingUsbBoard(): void {
    this._pollingUsbInterval = setInterval(() => {
      this._retrieveDetectedUsbBoard();
    }, 2000)
  }

  public stopPollingUsbBoard(): void {
    clearInterval(this._pollingUsbInterval);
    this._detectedUsbBoard = null;
    this._detectedUsbBoardObservable.next(this._noBoard);
  }

  private _retrieveDetectedUsbBoard(): void {
    this.boardProvider.getUsbConnectedBoard().then(
      (board: BoardModel) => {
        this._detectedUsbBoard = board;
        this._detectedUsbBoardObservable.next(this._detectedUsbBoard);
      }, () => {
        this._detectedUsbBoard = null;
        this._detectedUsbBoardObservable.next(this._noBoard);
      }
    )
  }

  public cleanUserBoards(): Promise<any> {
    this._currentBoards = [];
    this._currentBoardsObservable.next([]);
    return this.boardDB.removeAll();
  }

}