import { BitPayClient } from './BitPayClient';
import { TokenContainer } from '../TokenContainer';
import { BillInterface } from '../Model';
import { Facade } from '../Facade';
import { BitPayExceptionProvider } from '../Exceptions/BitPayExceptionProvider';

export class BillClient {
  private bitPayClient: BitPayClient;
  private tokenContainer: TokenContainer;

  constructor(bitPayClient: BitPayClient, tokenContainer: TokenContainer) {
    this.bitPayClient = bitPayClient;
    this.tokenContainer = tokenContainer;
  }

  /**
   * Create a BitPay Bill.
   *
   * @param bill A Bill object with request parameters defined.
   * @param facade The facade used to create it.
   * @param signRequest Signed request.
   * @returns Bill
   * @throws BitPayGenericException BitPayGenericException
   * @throws BitPayApiException BitPayApiException
   */
  public async create(bill: BillInterface, facade: string, signRequest: boolean): Promise<BillInterface> {
    bill.token = this.tokenContainer.getToken(facade);
    const result = await this.bitPayClient.post('bills', bill, signRequest);

    try {
      return <BillInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwSerializeResourceException('Bill', e.message);
      throw new Error();
    }
  }

  /**
   * Retrieve a BitPay bill by bill id using the specified facade.
   *
   * @param billId The id of the bill to retrieve
   * @param facade The facade used to retrieve it.
   * @param signRequest Signed request
   * @returns Bill
   * @throws BitPayGenericException BitPayGenericException class
   * @throws BitPayApiException BitPayApiException class
   */
  public async get(billId: string, facade: string, signRequest: boolean): Promise<BillInterface> {
    const params = { token: this.tokenContainer.getToken(facade) };
    const result = await this.bitPayClient.get('bills/' + billId, params, signRequest);

    try {
      return <BillInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Bill', e.message);
      throw new Error();
    }
  }

  /**
   * Retrieve a collection of BitPay bills.
   *
   * @param status
   * @returns Bill[]
   * @throws BitPayGenericException BitPayGenericException
   * @throws BitPayApiException BitPayApiException
   */
  public async getBills(status: string | null): Promise<BillInterface[]> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };
    if (status) {
      params['status'] = status;
    }

    const result = await this.bitPayClient.get('bills', params, true);

    try {
      return <BillInterface[]>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Bill', e.message);
      throw new Error();
    }
  }

  /**
   * Update a BitPay Bill.
   *
   * @param bill
   * @param billId
   * @returns Bill
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async update(bill: BillInterface, billId: string): Promise<BillInterface> {
    const result = await this.bitPayClient.put('bills/' + billId, bill);

    try {
      return <BillInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Bill', e.message);
      throw new Error();
    }
  }

  /**
   * Delivery a BitPay Bill.
   *
   * @param billId
   * @param billToken
   * @param signRequest
   * @returns string
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async deliver(billId: string, billToken: string, signRequest: boolean): Promise<boolean> {
    const params = { token: billToken };
    const result = await this.bitPayClient.post('bills/' + billId + '/deliveries', params, signRequest);

    try {
      return <string>JSON.parse(result) == 'Success';
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Bill', e.message);
      throw new Error();
    }
  }
}
