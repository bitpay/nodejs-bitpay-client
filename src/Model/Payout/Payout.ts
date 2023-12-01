import { PayoutTransaction } from './PayoutTransaction';

export interface PayoutInterface {
  amount: number;
  currency: string;
  ledgerCurrency: string;

  token?: string;
  effectiveDate?: string;
  dateExecuted?: string;
  accountId?: string;
  reference?: string;
  notificationEmail?: string;
  notificationURL?: string;
  email?: string;
  recipientId?: string;
  shopperId?: string;
  label?: string;
  message?: string;

  id?: string;
  status?: string;
  groupId?: string;
  requestDate?: string;
  exchangeRates?: Record<string, Record<string, number>>;
  transactions?: PayoutTransaction[];
  code?: number;
  ignoreEmails?: boolean;
}

export class Payout implements PayoutInterface {
  amount: number;
  currency: string;
  ledgerCurrency: string;

  token?: string;
  effectiveDate?: string;
  dateExecuted?: string;
  accountId?: string;
  reference?: string;
  notificationEmail?: string;
  notificationURL?: string;
  email?: string;
  recipientId?: string;
  shopperId?: string;
  label?: string;
  message?: string;

  id?: string;
  status?: string;
  groupId?: string;
  requestDate?: string;
  exchangeRates?: Record<string, Record<string, number>>;
  transactions?: PayoutTransaction[];
  code?: number;
  ignoreEmails = false;

  /**
   * Constructor, create a request Payout object.
   *
   * @param amount            The decimal amount to be paid in the Payout request.
   * @param currency          The three digit currency string for the Payout to use.
   * @param ledgerCurrency    The three digit currency string for the Payout to use.
   */
  public constructor(amount: number, currency: string, ledgerCurrency: string) {
    this.currency = currency;
    this.amount = amount;
    this.ledgerCurrency = ledgerCurrency;
  }
}
