export class BitPayException implements Error {
  public readonly message: string | null;
  public readonly name: string = 'BITPAY-EXCEPTION';
  public readonly stack: string;

  /**
   * Construct the BitPayException.
   *
   * @param message string [optional] The Exception message to throw.
   */
  public constructor(message: string = null) {
    this.message = message ? message : this.message;
  }
}

export default BitPayException;
