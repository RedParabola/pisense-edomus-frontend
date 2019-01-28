/**
 * Abstract class that every API Error must extend
 */
export class ApiError {

  /**
   * ApiError constructor.
   * @param originalError Error coming directly from server
   */
  constructor(public originalError?: any) { }

}
