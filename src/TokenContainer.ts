import {Config} from "./Config";
import BitPayException from "./Exceptions/BitPayException";
import {Facade} from "./Facade";

export class TokenContainer {

    private readonly data: Map<string, string>;

    constructor(tokens?: Object) {
        this.data = new Map<string, string>();
        if (tokens !== undefined) {
            (Object.keys(tokens) as (keyof typeof tokens)[]).forEach((key, index) => {
                this.add(key, String(tokens[key]));
            });
        }
    }

    public getToken(key: string): string {
        if (!this.data.has(key)) {
            throw new BitPayException(null, "There is no token for the specified key : " + key);
        }

        return this.data.get(key);
    }

    public addPos(token: string): void {
        this.data.set(Facade.Pos, token);
    }

    public addMerchant(token: string): void {
        this.data.set(Facade.Merchant, token);
    }

    public addPayout(token: string): void {
        this.data.set(Facade.Payout, token);
    }

    public isTokenExist(facade: Facade): boolean {
        return this.data.has(facade)
    }

    private add(facade: string, token: string): void {
        this.data.set(facade, token);
    }
}