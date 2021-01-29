export interface PayoutInstructionBtcSummaryInterface {
    paid: number | null;
    unpaid: number | null;
}

export class PayoutInstructionBtcSummary implements PayoutInstructionBtcSummaryInterface {

    paid: number | null;
    unpaid: number | null;

    public constructor(paid: number, unpaid: number) {
        this.paid = paid;
        this.unpaid = unpaid;
    }
}
