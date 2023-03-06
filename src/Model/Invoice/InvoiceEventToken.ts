export interface InvoiceEventTokenInterface {
  token: string | null;
  events: string[] | [];
  actions: string[] | [];
}

export class InvoiceEventToken implements InvoiceEventTokenInterface {
  actions: string[] | [];
  events: string[] | [];
  token: string | null;
}
