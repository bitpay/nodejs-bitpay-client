import { Invoice } from '../../src/Model';
import { Buyer } from '../../src/Model/Invoice/Buyer';
import { ClientProvider } from '../ClientProvider';

export class InvoiceRequests {
  public async createInvoice() {
    const invoice = new Invoice(10.0, 'USD');
    invoice.notificationEmail = 'some@email.com';
    invoice.notificationURL = 'https://some-url.com';

    const buyer = new Buyer();
    buyer.name = 'Test';
    buyer.email = 'test@email.com';
    buyer.address1 = '168 General Grove';
    buyer.country = 'AD';
    buyer.locality = 'Port Horizon';
    buyer.notify = true;
    buyer.phone = '+990123456789';
    buyer.postalCode = 'KY7 1TH';
    buyer.region = 'New Port';

    invoice.buyer = buyer;

    const client = ClientProvider.create();

    return await client.createInvoice(invoice);
  }

  public async getInvoice() {
    const client = ClientProvider.create();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const invoice = client.getInvoice('myInvoiceId');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const invoiceByGuid = client.getInvoiceByGuid('invoiceGuid'); // we can add a GUID during the invoice creation

    const params = {
      dateStart: '2023-04-14',
      dateEnd: '2023-04-17',
      status: null,
      orderId: null,
      limit: null,
      offset: null
    };

    return await client.getInvoices(params);
  }

  public async updateInvoice() {
    const client = ClientProvider.create();
    const params = {
      buyerSms: '123321312'
    };

    return await client.updateInvoice('someId', params);
  }

  public async cancelInvoice() {
    const client = ClientProvider.create();

    await client.cancelInvoice('someInvoiceId');

    await client.cancelInvoiceByGuid('someGuid');
  }

  public async requestInvoiceWebhookToBeResent() {
    const client = ClientProvider.create();

    const invoiceId = 'myInvoiceId';
    const invoice = await client.getInvoice(invoiceId);

    return await client.requestInvoiceWebhookToBeResent(invoiceId, invoice.token);
  }
}
