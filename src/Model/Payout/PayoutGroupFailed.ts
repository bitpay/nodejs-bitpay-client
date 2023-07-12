export interface PayoutGroupFailedInterface {
    errMessage: string;
    payoutId: string | null;
    payee: string | null;
}

export class PayoutGroupFailed implements PayoutGroupFailedInterface {
    errMessage = '';
    payee: string | null;
    payoutId: string | null;
}