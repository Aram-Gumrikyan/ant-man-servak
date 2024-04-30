import validator from "validator";
import ValidationError from "../errors/validation.error.js";
import ERROR_CODES from "../errors/error-codes.js";

export default class Url {
  private url: string = "";

  constructor(u: string) {
    this.setUrl(u);
  }

  private setUrl(u: string) {
    this.isValidUrl({ url: u, riseErrorOnFail: true });
    this.url = u;
    return this.getUrl();
  }

  public getUrl() {
    return this.url;
  }

  private isValidUrl({
    url,
    riseErrorOnFail,
  }: {
    url: string;
    riseErrorOnFail: boolean;
  }) {
    const isValid = validator.isURL(url);
    if (riseErrorOnFail && !isValid) {
      throw new ValidationError(ERROR_CODES.INVALID_URL);
    }
    return isValid;
  }
}
