export interface PayoutGroupFailedInterface {
  errMessage: string;
  payoutId?: string;
  payee?: string;
}

export class PayoutGroupFailed implements PayoutGroupFailedInterface {
  errMessage = '';
  payee?: string;
  payoutId?: string;
}
