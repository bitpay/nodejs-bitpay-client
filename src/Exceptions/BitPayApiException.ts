import BitPayException from './BitPayException';

export class BitPayApiException extends BitPayException {
  public readonly name: string = 'BITPAY-EXCEPTION';
  public readonly code: string | null = 'BITPAY-EXCEPTION';
  /**
   * Construct the BitPayException.
   *
   * @param message string [optional] The Exception message to throw.
   * @param code    string [optional] The Exception code to throw.
   */
  public constructor(message: string, code: string | null) {
    super(message);
    this.code = code;
  }
}

export default BitPayApiException;
