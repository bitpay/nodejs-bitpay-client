import BitPayException from './BitPayException';

export class PayoutException implements BitPayException {
  public readonly message: string = 'An unexpected error occurred while trying to manage the payout batch';
  public readonly name: string = 'BITPAY-PAYOUT-GENERIC';
  public readonly code: number = 121;
  public readonly stack: string;
  public readonly apiCode: string = '000000';

  /**
   * Construct the PayoutException.
   *
   * @param message string [optional] The Exception message to throw.
   * @param apiCode string [optional] The API Exception code to throw.
   */
  public constructor(message: string, apiCode = '000000') {
    this.message = message ? message : this.message;
    this.apiCode = apiCode ? apiCode : this.apiCode;
  }
}

export default PayoutException;
