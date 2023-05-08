import SubscriptionException from './SubscriptionException';

export class WalletQueryException implements SubscriptionException {
  public readonly message: string = 'Failed to retrieve subscription';
  public readonly name: string = 'BITPAY-SUBSCRIPTION-GET';
  public readonly code: number = 173;
  public readonly stack: string;
  public readonly apiCode: string = '000000';

  /**
   * Construct the SubscriptionQueryException.
   *
   * @param message string [optional] The Exception message to throw.
   * @param apiCode string [optional] The API Exception code to throw.
   */
  public constructor(message: string, apiCode = '000000') {
    this.message = message ? message : this.message;
    this.apiCode = apiCode ? apiCode : this.apiCode;
  }
}

export default WalletQueryException;
