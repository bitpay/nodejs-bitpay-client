import { PayoutTransaction } from './PayoutTransaction';

export interface PayoutInterface {
  token: string | null;

  amount: number | null;
  currency: string | null;
  effectiveDate: string | null;
  dateExecuted: string | null;
  ledgerCurrency: string | null;
  accountId: string | null;
  reference: string | null;
  notificationEmail: string | null;
  notificationURL: string | null;
  email: string | null;
  recipientId: string | null;
  shopperId: string | null;
  label: string | null;
  message: string | null;

  id: string | null;
  status: string | null;
  groupId: string | null;
  requestDate: number | null;
  exchangeRates: string | null;
  transactions: PayoutTransaction[];
  code: number | null;
}

export class Payout implements PayoutInterface {
  token: string | null;

  amount: number | null;
  currency: string | null;
  effectiveDate: string | null;
  dateExecuted: string | null;
  ledgerCurrency: string | null;
  accountId: string | null;
  reference: string | null;
  notificationEmail: string | null;
  notificationURL: string | null;
  email: string | null;
  recipientId: string | null;
  shopperId: string | null;
  label: string | null;
  message: string | null;

  id: string | null;
  status: string | null;
  groupId: string | null;
  requestDate: number | null;
  exchangeRates: string | null;
  transactions: PayoutTransaction[];
  code: number | null;

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
