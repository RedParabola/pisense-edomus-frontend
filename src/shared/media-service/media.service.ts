//Basic
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

//Config
import { MediaConfig } from '../../config/media.config';

//Constants
import { MEDIA_BREAKPOINTS } from './media.constants';

/**
 * Service used to know the current breakpoint of the application in the business context.
 */
@Injectable()
export class MediaService {

  /**
   * Observable with the current breakpoint on the application.
   */
  private currentViewMedia: BehaviorSubject<string>;

  /**
   * Observable boolean, if the application is on the LG breakpoint, this variable evaluate true.
   */
  private isLgObservable = new BehaviorSubject<boolean>(false);

  /**
   * Observable boolean, if the application is on the MD breakpoint, this variable evaluate true.
   */
  private isMdObservable = new BehaviorSubject<boolean>(false);

  /**
   * Observable boolean, if the application is on the XS breakpoint, this variable evaluate true.
   */
  private isXsObservable = new BehaviorSubject<boolean>(false);

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param media media breakpoints configuration
   */
  constructor(private media: MediaConfig) {
    this.media = media;
    this.currentViewMedia = new BehaviorSubject<string>(this._calculateMedia(window.screen.width));
    //Observe the window.resize in order to calculate the change of the webview
    Observable.fromEvent(window, 'resize')
      .map((ev: any) => ev.currentTarget.innerWidth)
      .map(width => this._calculateMedia(width))
      .distinctUntilChanged()
      .subscribe(value => {
        this.currentViewMedia.next(value);
      });
    // Set new value from the event resize
    this.currentMedia()
      .subscribe((media: string) => {
        this.isXsObservable.next(media === MEDIA_BREAKPOINTS.XS);
        this.isMdObservable.next(media === MEDIA_BREAKPOINTS.MD);
        this.isLgObservable.next(media === MEDIA_BREAKPOINTS.LG);
      });
  }

  /**
   * Method used to return the observable of current breakpoint in the application.
   */
  public currentMedia(): Observable<string> {
    return this.currentViewMedia.asObservable().share();
  }

  /**
   * Method that return the observable for the current breakpoint, true if the application is MD.
   */
  public isMd(): Observable<boolean> {
    return this.isMdObservable.asObservable().share();
  }

  /**
   * Method that return the observable for the current breakpoint, true if the application is LG.
   */
  public isLg(): Observable<boolean> {
    return this.isLgObservable.asObservable().share();
  }

  /**
   * Method that return the observable for the current breakpoint, true if the application is LG.
   */
  public isXs(): Observable<boolean> {
    return this.isXsObservable.asObservable().share();
  }

  /**
   * Method used to calculate the current breakpoint of the application.
   * @param width Current width of the application.
   */
  private _calculateMedia(width: number): string {
    if (this.media.LG < width) {
      return MEDIA_BREAKPOINTS.LG;
    }
    if (this.media.MD < width) {
      return MEDIA_BREAKPOINTS.MD;
    }
    return MEDIA_BREAKPOINTS.XS;
  }
}
