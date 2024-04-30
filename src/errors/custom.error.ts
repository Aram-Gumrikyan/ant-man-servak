import ERROR_CODES from "./error-codes.js";

export default class CustomError extends Error {
  private ErrorCode: string = ERROR_CODES.NOT_SPECIFIED;

  constructor(errorCode: ERROR_CODES, message?: string) {
    super(message);

    this.ErrorCode = errorCode;
  }

  public getErrorCode() {
    return this.ErrorCode;
  }
}
