import { BitPayExceptionProvider } from '../Exceptions/BitPayExceptionProvider';
import { BitPayApiException } from '../Exceptions/BitPayApiException';

export class BitPayResponseParser {
  public async getJsonDataFromJsonResponse(responseObj: object) {
    if (responseObj === null) {
      BitPayExceptionProvider.throwApiExceptionWithMessage('HTTP response is null', null);
    }

    try {
      if (Object.prototype.hasOwnProperty.call(responseObj, 'status')) {
        if (responseObj['status'] === 'error') {
          BitPayExceptionProvider.throwApiExceptionWithMessage(
            responseObj['error'] ?? null,
            responseObj['code'] ?? null
          );
        }

        if (
          Object.prototype.hasOwnProperty.call(responseObj, 'data') &&
          Object.keys(responseObj['data']).length === 0
        ) {
          return JSON.stringify(responseObj);
        }
      }

      if (Object.prototype.hasOwnProperty.call(responseObj, 'error')) {
        BitPayExceptionProvider.throwApiExceptionWithMessage(responseObj['error'] ?? null, responseObj['code'] ?? null);
      }

      if (Object.prototype.hasOwnProperty.call(responseObj, 'errors')) {
        let result = '';
        responseObj['errors'].forEach((error, index) => {
          if (index !== 0) {
            result += ' ';
          }

          const errorText = error['error'].endsWith('.') ? error['error'].slice(0, -1) : error['error'];
          const param = Object.prototype.hasOwnProperty.call(error, 'param') ? error['param'] : '';
          result += `${errorText} ${param}.`;

          if (!result.endsWith('.')) {
            result += '.';
          }
        });

        BitPayExceptionProvider.throwApiExceptionWithMessage(result, responseObj['code'] ?? null);
      }

      if (Object.prototype.hasOwnProperty.call(responseObj, 'success')) {
        return JSON.stringify(responseObj['success']);
      }

      if (Object.prototype.hasOwnProperty.call(responseObj, 'data')) {
        return JSON.stringify(responseObj['data']);
      }

      return JSON.stringify(responseObj);
    } catch (e: any) {
      if (e instanceof BitPayApiException) {
        throw e;
      }

      BitPayExceptionProvider.throwApiExceptionWithMessage(e.message, null);
    }
  }

  public static jsonToBoolean(json: string): boolean {
    const result = JSON.parse(json);

    let status: string;
    if (typeof result === 'string') {
      status = result;
    } else {
      status = result.status;
    }

    return status === 'success' || status === 'Success';
  }
}
