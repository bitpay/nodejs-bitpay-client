import { BitPayResponseParser } from '../../src/util/BitPayResponseParser';

describe('BitPayResponse', function () {
  it('should handle multiple errors', async () => {
    const bitPayResponseParser = new BitPayResponseParser();

    try {
      await bitPayResponseParser.getJsonDataFromJsonResponse({
        errors: [
          { error: 'Missing required parameter.', param: 'price' },
          { error: 'Missing required parameter.', param: 'currency' }
        ]
      });
    } catch (e: any) {
      expect(e.message).toBe('Missing required parameter price. Missing required parameter currency.');
    }
  });
});
