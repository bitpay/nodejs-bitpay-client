import {Invoice} from "../../src/Model";
import {Buyer} from "../../src/Model/Invoice/Buyer";
import {ClientProvider} from "../ClientProvider";

class InvoiceRequests {
  public createInvoice(): void {
    const invoice = new Invoice(10.0, 'USD');
    invoice.notificationEmail = 'some@email.com';
    invoice.notificationURL = 'https://some-url.com';

    const buyer = new Buyer();
    buyer.name = "Test";
    buyer.email = "test@email.com";
    buyer.address1 = "168 General Grove";
    buyer.country = "AD";
    buyer.locality = "Port Horizon";
    buyer.notify = true;
    buyer.phone = "+990123456789";
    buyer.postalCode = "KY7 1TH";
    buyer.region = "New Port";

    invoice.buyer = buyer

    const client = ClientProvider.createPos();

    const createdInvoice = client.createInvoice(invoice);
  }

  public getInvoice(): void {
    const client = ClientProvider.createPos();

    const invoice = client.getInvoice('myInvoiceId');
  }
}