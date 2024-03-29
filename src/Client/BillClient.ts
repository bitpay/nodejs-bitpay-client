import { BitPayClient } from './BitPayClient';
import { TokenContainer } from '../TokenContainer';
import { BillInterface } from '../Model';
import { Facade } from '../Facade';
import { BitPayExceptions as Exceptions } from '../index';

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
   * @throws BillCreationException
   */
  public async create(bill: BillInterface, facade: string, signRequest: boolean): Promise<BillInterface> {
    bill.token = this.tokenContainer.getToken(facade);

    try {
      const result = await this.bitPayClient.post('bills', bill, signRequest);
      return <BillInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.BillCreation(
        'failed to deserialize BitPay server response (Bill) : ' + e.message,
        e.apiCode
      );
    }
  }

  /**
   * Retrieve a BitPay bill by bill id using the specified facade.
   *
   * @param billId The id of the bill to retrieve
   * @param facade The facade used to retrieve it.
   * @param signRequest Signed request
   * @returns Bill
   * @throws BillQueryException
   */
  public async get(billId: string, facade: string, signRequest: boolean): Promise<BillInterface> {
    const params = { token: this.tokenContainer.getToken(facade) };

    try {
      const result = await this.bitPayClient.get('bills/' + billId, params, signRequest);
      return <BillInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.BillQuery('failed to deserialize BitPay server response (Bill) : ' + e.message, e.apiCode);
    }
  }

  /**
   * Retrieve a collection of BitPay bills.
   *
   * @param status
   * @returns Bill[]
   * @throws BillQueryException
   */
  public async getBills(status: string | null): Promise<BillInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };
    if (status) {
      params['status'] = status;
    }

    try {
      const result = await this.bitPayClient.get('bills', params, true);
      return <BillInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.BillQuery('failed to deserialize BitPay server response (Bill) : ' + e.message, e.apiCode);
    }
  }

  /**
   * Update a BitPay Bill.
   *
   * @param bill
   * @param billId
   * @returns Bill
   * @throws BillUpdateException
   */
  public async update(bill: BillInterface, billId: string): Promise<BillInterface> {
    try {
      const result = await this.bitPayClient.put('bills/' + billId, bill);
      return <BillInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.BillUpdate('failed to deserialize BitPay server response (Bill) : ' + e.message, e.apiCode);
    }
  }

  /**
   * Delivery a BitPay Bill.
   *
   * @param billId
   * @param billToken
   * @param signRequest
   * @returns string
   * @throws BillDeliveryException
   */
  public async deliver(billId: string, billToken: string, signRequest: boolean): Promise<boolean> {
    const params = { token: billToken };

    try {
      const result = await this.bitPayClient.post('bills/' + billId + '/deliveries', params, signRequest);
      return <string>JSON.parse(result) == 'Success';
    } catch (e) {
      throw new Exceptions.BillDelivery(
        'failed to deserialize BitPay server response (Bill) : ' + e.message,
        e.apiCode
      );
    }
  }
}
