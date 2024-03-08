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

    const client = ClientProvider.create();

    const createdInvoice = client.createInvoice(invoice);
  }

  public getInvoice(): void {
    const client = ClientProvider.create();

    const invoice = client.getInvoice('myInvoiceId');
    const invoiceByGuid = client.getInvoiceByGuid('invoiceGuid'); // we can add a GUID during the invoice creation

    const params = {
      dateStart: '2023-04-14',
      dateEnd: '2023-04-17',
      status: null,
      orderId: null,
      limit: null,
      offset: null
    };
    const invoices = client.getInvoices(params)
  }

  public updateInvoice(): void {
    const client = ClientProvider.create();
    const params = [];
    params['buyerSms'] = '123321312';

    const updatedInvoice = client.updateInvoice('someId', params)
  }

  public cancelInvoice(): void {
    const client = ClientProvider.create();

    client.cancelInvoice('someInvoiceId');

    client.cancelInvoiceByGuid('someGuid');
  }

  public requestInvoiceWebhookToBeResent(): void {
    const client = ClientProvider.create();

    client.deliverBill('someBillId', 'myBillToken');
  }
}