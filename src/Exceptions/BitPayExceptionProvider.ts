import { LoggerProvider } from '../Logger/LoggerProvider';
import BitPayGenericException from './BitPayGenericException';
import BitPayApiException from './BitPayApiException';
import BitPayValidationException from './BitPayValidationException';

export class BitPayExceptionProvider {
  static readonly GENERIC_API_UNMAPPED_ERROR_CODE: string = '000000';

  public static throwGenericExceptionWithMessage(errorMessage: string | null): void {
    if (errorMessage == null) {
      errorMessage = 'Unexpected generic error';
    }
    this.logErrorMessage(errorMessage);

    throw new BitPayGenericException(errorMessage);
  }

  public static throwApiExceptionWithMessage(errorMessage: string | null, code: string | null): void {
    if (errorMessage == null) {
      errorMessage = 'Unexpected api error';
    }
    this.logErrorMessage(errorMessage);

    code = code ? code : this.GENERIC_API_UNMAPPED_ERROR_CODE;

    throw new BitPayApiException(errorMessage, code);
  }

  public static throwDeserializeResourceException(resource: string | null, errorMessage: string | null): void {
    let message: string;
    if (resource === null) {
      message = 'Failed to deserialize BitPay server response (' + errorMessage + '): ' + resource;
    } else {
      message = 'Failed to deserialize BitPay server response ( %s )';
    }
    this.logErrorMessage(message);

    this.throwGenericExceptionWithMessage(message);
  }

  public static throwDeserializeException(errorMessage: string | null): void {
    const message = 'Failed to deserialize BitPay server response : ' + errorMessage;

    this.logErrorMessage(message);
  }

  public static throwEncodeException(errorMessage: string | null): void {
    if (errorMessage == null) {
      errorMessage = 'Unexpected encode error';
    }
    this.logErrorMessage(errorMessage);

    const message = 'Failed to encode params : ' + errorMessage;

    this.throwGenericExceptionWithMessage(message);
  }

  public static throwSerializeResourceException(resource: string, errorMessage: string | null): void {
    const message = 'Failed to serialize ( ' + resource + ' ) : ' + errorMessage;

    this.logErrorMessage(message);

    this.throwGenericExceptionWithMessage(message);
  }

  public static throwSerializeParamsException(errorMessage: string | null): void {
    const message = 'Failed to serialize params : ' + errorMessage;

    this.logErrorMessage(message);
  }

  public static throwValidationException(errorMessage: string | null): void {
    if (errorMessage == null) {
      errorMessage = 'Unexpected validation error';
    }
    this.logErrorMessage(errorMessage);

    throw new BitPayValidationException(errorMessage);
  }

  public static throwMissingParameterException(): void {
    const message = 'Missing required parameter';

    this.logErrorMessage(message);

    throw new BitPayValidationException(message);
  }

  public static throwInvalidCurrencyException(currencyCode: string | null): void {
    const message: string = 'Currency code ' + currencyCode + ' must be a type of Model.Currency.Currency';

    this.throwValidationException(message);
  }

  private static logErrorMessage(message: string): void {
    if (message === null) {
      return;
    }

    LoggerProvider.getLogger().logError(message);
  }
}
