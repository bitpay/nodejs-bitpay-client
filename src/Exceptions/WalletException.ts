import BitPayException from "./BitPayException";

export class WalletException implements BitPayException {

    public readonly message: string = "An unexpected error occurred while trying to manage the wallet";
    public readonly name: string = "BITPAY-WALLET-GENERIC";
    public readonly code: number = 181;
    public readonly stack: string;

    /**
     * Construct the WalletException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default WalletException;
