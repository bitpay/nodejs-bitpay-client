import WalletException from "./WalletException";

export class WalletQueryException implements WalletException {

    public readonly message: string = "Failed to retrieve wallet";
    public readonly name: string = "BITPAY-WALLET-GET";
    public readonly code: number = 182;
    public readonly stack: string;

    /**
     * Construct the WalletQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     */
    public constructor(message: string) {
        this.message = Boolean(message) ? message: this.message;
    }
}

export default WalletQueryException;
