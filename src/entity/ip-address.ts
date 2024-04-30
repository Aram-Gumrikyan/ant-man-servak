import ERROR_CODES from "../errors/error-codes.js";
import ValidationError from "../errors/validation.error.js";

export default class IpAddress {
  private address: string = "";

  constructor(a: string) {
    this.setAddress(a);
  }

  public setAddress(a: string) {
    this.isValidAddress({ address: a, riseErrorOnFail: true });
    this.address = a;
    return this.getAddress();
  }

  public getAddress() {
    return this.address;
  }

  private isValidAddress({
    address,
    riseErrorOnFail,
  }: {
    address: string;
    riseErrorOnFail: boolean;
  }) {
    const isValid = this.isIPv4(address);
    if (riseErrorOnFail && !isValid) {
      throw new ValidationError(ERROR_CODES.INVALID_ADDRESS);
    }
    return isValid;
  }

  private isIPv4(address: string) {
    const octets = address.split(".");
    if (octets.length !== 4) return false;

    for (const octet of octets) {
      const num = parseInt(octet, 10);
      if (isNaN(num) || num < 0 || num > 255) return false;
    }

    return true;
  }
}
