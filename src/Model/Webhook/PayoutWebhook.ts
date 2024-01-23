import {PayoutTransaction} from "../Payout/PayoutTransaction";

export interface PayoutWebhookInterface {
  id?: string;
  recipientId?: string;
  shopperId?: string;
  price?: number;
  currency?: string;
  ledgerCurrency?: string;
  exchangeRates?: Record<string, Record<string, number>>;
  email?: string;
  reference?: string;
  label?: string;
  notificationUrl?: string;
  notificationEmail?: string;
  effectiveDate?: string;
  requestDate?: string;
  status?: string;
  transactions?: PayoutTransaction[];
  accountId?: string;
  date?: string;
  groupId?: string;
}