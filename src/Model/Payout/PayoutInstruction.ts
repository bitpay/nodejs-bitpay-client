import {PayoutInstructionTransaction} from "./PayoutInstructionTransaction";
import {PayoutInstructionBtcSummary} from "./PayoutInstructionBtcSummary";
import {RecipientReferenceMethod} from "../../index";
import PayoutCreationException from "../../Exceptions/PayoutCreationException";

export interface PayoutInstructionInterface {
    amount: number | null;
    email: string | null;
    recipientId: string | null;
    shopperId: string | null;
    label: string | null;
    id: string | null;
    address: string | null;

    btc: PayoutInstructionBtcSummary;
    transactions: PayoutInstructionTransaction[];
    status: string | null;
}

export class PayoutInstruction implements PayoutInstructionInterface {

    amount: number | null;
    btc: PayoutInstructionBtcSummary;
    email: string | null;
    id: string | null;
    label: string | null;
    recipientId: string | null;
    shopperId: string | null;
    status: string | null;
    transactions: PayoutInstructionTransaction[];
    address: string | null;

    /**
     * Constructor, create a PayoutInstruction object.
     *
     * @param amount      float amount (in currency of batch).
     * @param method      int Method used to target the recipient.
     * @param methodValue string value for the choosen target method.
     * @throws PayoutCreationException BitPayException class
     */
    public constructor(amount: number, method: number, methodValue: string) {
        this.amount = amount;
        switch (method) {
            case RecipientReferenceMethod.EMAIL:
                this.email = methodValue;
                break;
            case RecipientReferenceMethod.RECIPIENT_ID:
                this.recipientId = methodValue;
                break;
            case RecipientReferenceMethod.SHOPPER_ID:
                this.shopperId = methodValue;
                break;
            default:
                throw new PayoutCreationException("method code must be a type of RecipientReferenceMethod");
        }
    }
}
