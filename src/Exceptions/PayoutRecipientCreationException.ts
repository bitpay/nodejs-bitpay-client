import PayoutRecipientException from './PayoutRecipientException';

export class PayoutRecipientCreationException implements PayoutRecipientException {
  public readonly message: string = 'Failed to create payout recipient';
  public readonly name: string = 'BITPAY-PAYOUT-RECIPIENT-SUBMIT';
  public readonly code: number = 192;
  public readonly stack: string;
  public readonly apiCode: string = '000000';

  /**
   * Construct the PayoutRecipientCreationException.
   *
   * @param message string [optional] The Exception message to throw.
   * @param apiCode string [optional] The API Exception code to throw.
   */
  public constructor(message: string, apiCode = '000000') {
    this.message = message ? message : this.message;
    this.apiCode = apiCode ? apiCode : this.apiCode;
  }
}

export default PayoutRecipientCreationException;
