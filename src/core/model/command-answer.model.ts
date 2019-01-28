import { CommandRequestModel } from "./command-request.model";

/**
 * Model for command answer.
 */
export interface CommandAnswerModel {

  
  /**
   * Command request to which answers.
   */
  commandRequest: CommandRequestModel;

  /**
   * Answer message.
   */
  answer: string;

}
