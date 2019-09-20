/**
 * Model for command request.
 */
export interface CommandRequestModel {

  /**
   * Command to be done.
   */
  command: string;

  /**
   * Parameters for the command when needed.
   */
  parameters?: any;

}
