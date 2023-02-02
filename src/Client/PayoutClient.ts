import {BitPayClient} from "./BitPayClient";
import {TokenContainer} from "../TokenContainer";
import {GuidGenerator} from "../util/GuidGenerator";
import {Facade} from "../Facade";
import {BitPayExceptions as Exceptions} from "../index";
import {PayoutInterface} from "../Model";
import {BitPayResponseParser} from "../util/BitPayResponseParser";

export class PayoutClient {

    private bitPayClient: BitPayClient;
    private tokenContainer: TokenContainer;
    private guidGenerator: GuidGenerator;

    constructor(bitPayClient: BitPayClient, tokenContainer: TokenContainer, guidGenerator: GuidGenerator) {
        this.bitPayClient = bitPayClient;
        this.tokenContainer = tokenContainer;
        this.guidGenerator = guidGenerator;
    }

    public async submit(payout: PayoutInterface): Promise<PayoutInterface> {
        payout.token = this.tokenContainer.getToken(Facade.Payout);

        try {
            const result = await this.bitPayClient.post("payouts", payout, true);
            return <PayoutInterface>JSON.parse(result);
        } catch (e) {
            throw new Exceptions.PayoutCreation("failed to deserialize BitPay server response (Payout) : " + e.message, e.apiCode);
        }
    }

    public async get(payoutId: string): Promise<PayoutInterface> {
        const params = {'token': this.tokenContainer.getToken(Facade.Payout)};

        try {
            const result = await this.bitPayClient.get("payouts/" + payoutId, params, true)
            return <PayoutInterface>JSON.parse(result);
        } catch (e) {
            throw new Exceptions.PayoutQuery("failed to deserialize BitPay server response (Payout) : " + e.message, e.apiCode);
        }
    }

    public async getPayouts(params: {}): Promise<PayoutInterface[]> {
        params['token'] = this.tokenContainer.getToken(Facade.Payout);

        try {
            const result = await this.bitPayClient.get("payouts", params, true);
            return <PayoutInterface[]>JSON.parse(result);
        } catch (e) {
            throw new Exceptions.PayoutQuery("failed to deserialize BitPay server response (Payout) : " + e.message, e.apiCode);
        }
    }

    public requestNotification = async (payoutId: string): Promise<Boolean> => {
        const params = {'token': this.tokenContainer.getToken(Facade.Payout)};

        try {
            const result = await this.bitPayClient.post("payouts/" + payoutId + "/notifications", params, true);
            return BitPayResponseParser.jsonToBoolean(result);
        } catch (e) {
            throw new Exceptions.PayoutNotification("failed to deserialize BitPay server response (Payout) : " + e.message, e.apiCode);
        }
    }

    public cancel = async (payoutId: string): Promise<Boolean> => {
        const params = {'token': this.tokenContainer.getToken(Facade.Payout)};

        try {
            const result = await this.bitPayClient.delete("payouts/" + payoutId, params, true);
            return BitPayResponseParser.jsonToBoolean(result);
        } catch (e) {
            throw new Exceptions.PayoutDelete("failed to deserialize BitPay server response (Payout) : " + e.message, e.apiCode);
        }
    }
}