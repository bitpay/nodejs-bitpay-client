import { Currency } from '../../Currency';
import { Item } from './Item';
import { BitPayExceptionProvider } from '../../Exceptions/BitPayExceptionProvider';

export interface BillInterface {
  number: string;
  currency: string;
  email: string;
  items: Item[];
  token?: string;
  name?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  dueDate?: string;
  passProcessingFee?: boolean;
  status?: string;
  url?: string;
  createdDate?: string;
  id?: string;
  merchant?: string;
  cc?: string[];
}

export class Bill implements BillInterface {
  number: string;
  currency: string;
  email: string;
  items: Item[];
  address1?: string;
  address2?: string;
  cc?: string[];
  city?: string;
  country?: string;
  createdDate?: string;
  dueDate?: string;
  id?: string;
  merchant?: string;
  name?: string;
  passProcessingFee?: boolean;
  phone?: string;
  state?: string;
  status?: string;
  token?: string;
  url?: string;
  zip?: string;

  /**
   * Constructor, create a minimal request Bill object.
   *
   * @param number   A string for tracking purposes.
   * @param currency The three digit currency type used to compute the bill's amount.
   * @param email    The email address of the receiver for this bill.
   * @param items    The list of itens to add to this bill.
   */
  public constructor(number: string, currency: string, email: string, items: Item[]) {
    this.number = number;
    this.setCurrency(currency);
    this.email = email;
    this.items = items;
  }

  setCurrency(currency: string) {
    if (!Currency.isValid(currency)) BitPayExceptionProvider.throwInvalidCurrencyException(currency);

    this.currency = currency;
  }
}

export default Item;
