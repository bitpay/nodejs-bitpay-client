import RateException from './RateException';

export class RateQueryException implements RateException {
  public readonly message: string = 'Failed to retrieve rates';
  public readonly name: string = 'BITPAY-RATES-GET';
  public readonly code: number = 142;
  public readonly stack: string;
  public readonly apiCode: string = '000000';

  /**
   * Construct the RateQueryException.
   *
   * @param message string [optional] The Exception message to throw.
   * @param apiCode string [optional] The API Exception code to throw.
   */
  public constructor(message: string, apiCode = '000000') {
    this.message = message ? message : this.message;
    this.apiCode = apiCode ? apiCode : this.apiCode;
  }
}

export default RateQueryException;
