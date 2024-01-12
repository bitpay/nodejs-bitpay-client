import {ClientProvider} from "../ClientProvider";
import {Bill} from "../../src/Model";
import {Item} from "../../src/Model/Bill/Item";

class BillRequests {
  public createBill(): void {
    const client = ClientProvider.createPos();

    const bill = new Bill('someNumber', "USD", "some@email.com", [])
    client.createBill(bill);
  }

  public getBill(): void {
    const client = ClientProvider.createPos();

    const bill = client.getBill('someBillId');
  }

  public deliverBillViaEmail(): void {
    const client = ClientProvider.createPos();

    client.deliverBill('someBillId', 'myBillToken');
  }
}