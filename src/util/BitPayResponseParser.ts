import BitPayException from '../Exceptions/BitPayException';

export class BitPayResponseParser {
  public async responseToJsonString(response: Response) {
    try {
      if (response == null) {
        throw new BitPayException(null, 'Error: HTTP response is null');
      }
      let responsObj = await response.json();

      if (responsObj.hasOwnProperty('status')) {
        if (responsObj['status'] === 'error') {
          throw new BitPayException(
            null,
            'Error: ' + responsObj['error'],
            null,
            responsObj['code'],
          );
        }

        if (
          responsObj.hasOwnProperty('data') &&
          Object.keys(responsObj.data).length === 0
        ) {
          return JSON.stringify(responsObj);
        }
      }

      if (responsObj.hasOwnProperty('error')) {
        throw new BitPayException(null, 'Error: ' + responsObj['error']);
      } else if (responsObj.hasOwnProperty('errors')) {
        let message = '';
        responsObj['errors'].forEach(function(error) {
          message += '\n' + error.toString();
        });
        throw new BitPayException(null, 'Errors: ' + message);
      }

      if (responsObj.hasOwnProperty('success')) {
        return JSON.stringify(responsObj['success']);
      }

      if (responsObj.hasOwnProperty('data')) {
        return JSON.stringify(responsObj['data']);
      }

      return JSON.stringify(responsObj);
    } catch (e) {
      throw new BitPayException(
        null,
        'failed to retrieve HTTP response body : ' + e.message,
      );
    }
  }

  public static jsonToBoolean(json: string): Boolean {
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
