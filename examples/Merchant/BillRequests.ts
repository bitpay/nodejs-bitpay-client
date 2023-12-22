import {ClientProvider} from "../ClientProvider";
import {Bill} from "../../src/Model";
import {Item} from "../../src/Model/Bill/Item";

class BillRequests {
  public createBill(): void {
    const client = ClientProvider.create();

    const bill = new Bill('someNumber', "USD", "some@email.com", [])
    client.createBill(bill);
  }

  public getBill(): void {
    const client = ClientProvider.create();

    const bill = client.getBill('someBillId');

    const bills = client.getBills('draft');
  }

  public updateBill(): void {
    const client = ClientProvider.create();

    const item = new Item()
    item.price = 12.34;
    item.quantity = 2;
    item.description = 'someDescription';

    const bill = new Bill('someNumber', "USD", "some@email.com", []);

    client.updateBill(bill, bill.id)
  }

  public deliverBillViaEmail(): void {
    const client = ClientProvider.create();

    client.deliverBill('someBillId', 'myBillToken');
  }
}