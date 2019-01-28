/**
 * Model for a timer/attempts type setting.
 */
export interface TimerSettingModel {

  /**
   * Timer limit date
   */
  timerDate: number;

  /**
   * Number of attempts
   */
  attempts?: number;

}
