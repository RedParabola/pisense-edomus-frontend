import { Log, Logger } from 'ng2-logger'

/**
 * Service in charge of application log.
 */
export class LoggerService {

  /**
   * private reference to the log
   */
  private logger: Logger<any>;

  /**
   * Default constructor
   */
  constructor() {
  }

  /**
   * Print error message
   * @param context The actual context of the message
   * @param message the message itself
   */
  public error(context: any, ...data: any[]) {
    this.logger = Log.create(context.constructor.name);
    this.logger.color = 'red';
    data.forEach((element) => {
      this.logger.info('log: ', element);
    });
  }

  /**
  * Print warning message
  * @param context The actual context of the message
  * @param message the message itself
  */
  public warn(context: any, ...data: any[]) {
    this.logger = Log.create(context.constructor.name);
    this.logger.color = 'yellow';
    data.forEach((element) => {
      this.logger.info('log: ', element);
    });
  }

  /**
  * Print log message
  * @param context The actual context of the message
  * @param message the message itself
  */
  public log(context: any, ...data: any[]) {
    this.logger = Log.create(context.constructor.name);
    this.logger.color = 'blue';
    data.forEach((element) => {
      this.logger.info('log: ', element);
    });
  }

  /**
  * Print info message
  * @param context The actual context of the message
  * @param message the message itself
  */
  public info(context: any, ...data: any[]) {
    this.logger = Log.create(context.constructor.name);;
    this.logger.color = 'green';
    data.forEach((element) => {
      this.logger.info('log: ', element);
    });
  }

  /**
   * Enable production mode
   */
  public setProductionMode() {
    Log.setProductionMode();
  }

}