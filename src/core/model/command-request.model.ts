/**
 * Model for command request.
 */
export interface CommandRequestModel {

  /**
   * Command to be done.
   */
  command: string;

  /**
   * Value of the command when needed.
   */
  value?: string | number;

}
