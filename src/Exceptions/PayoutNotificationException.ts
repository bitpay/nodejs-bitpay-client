import PayoutException from './PayoutException';

export class PayoutNotificationException implements PayoutException {
  public readonly message: string = 'Failed to payout notification';
  public readonly name: string = 'BITPAY-PAYOUT-NOTIFICATION';
  public readonly code: number = 127;
  public readonly stack: string;
  public readonly apiCode: string = '000000';

  /**
   * Construct the PayoutNotificationException.
   *
   * @param message string [optional] The Exception message to throw.
   * @param apiCode string [optional] The API Exception code to throw.
   */
  public constructor(message: string, apiCode = '000000') {
    this.message = message ? message : this.message;
    this.apiCode = apiCode ? apiCode : this.apiCode;
  }
}

export default PayoutNotificationException;
