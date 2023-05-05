import PayoutException from './PayoutException';

export class PayoutQueryException implements PayoutException {
  public readonly message: string = 'Failed to retrieve payout';
  public readonly name: string = 'BITPAY-PAYOUT-GET';
  public readonly code: number = 123;
  public readonly stack: string;
  public readonly apiCode: string = '000000';

  /**
   * Construct the PayoutQueryException.
   *
   * @param message string [optional] The Exception message to throw.
   * @param apiCode string [optional] The API Exception code to throw.
   */
  public constructor(message: string, apiCode = '000000') {
    this.message = message ? message : this.message;
    this.apiCode = apiCode ? apiCode : this.apiCode;
  }
}

export default PayoutQueryException;
