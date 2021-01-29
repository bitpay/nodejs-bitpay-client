import BitPayException from "./BitPayException";

export class BillDeliveryException implements BitPayException {

    public readonly message: string = "An unexpected error occurred while trying to manage the bill";
    public readonly name: string = "BITPAY-BILL-DELIVERY";
    public readonly code: number = 115;
    public readonly stack: string;

    /**
     * Construct the BillDeliveryException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message : this.message;
    }
}

export default BillDeliveryException;
