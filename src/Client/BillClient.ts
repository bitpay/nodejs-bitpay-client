import {BitPayClient} from "./BitPayClient";
import {TokenContainer} from "../TokenContainer";
import {BillInterface} from "../Model";
import {Facade} from "../Facade";
import {BitPayExceptions as Exceptions} from "../index";

export class BillClient {

    private bitPayClient: BitPayClient;
    private tokenContainer: TokenContainer;

    constructor(bitPayClient: BitPayClient, tokenContainer: TokenContainer) {
        this.bitPayClient = bitPayClient;
        this.tokenContainer = tokenContainer;
    }

    public async create(bill: BillInterface, facade: string, signRequest: boolean): Promise<BillInterface> {
        bill.token = this.tokenContainer.getToken(facade);

        try {
            const result = await this.bitPayClient.post("bills", bill, signRequest);
            return <BillInterface>JSON.parse(result);
        } catch (e) {
            throw new Exceptions.BillCreation("failed to deserialize BitPay server response (Bill) : " + e.message, e.apiCode);
        }
    }

    public async get(billId: string, facade: string, signRequest: boolean): Promise<BillInterface> {
        const params = {'token': this.tokenContainer.getToken(facade)};

        try {
            const result = await this.bitPayClient.get("bills/" + billId, params, signRequest);
            return <BillInterface>JSON.parse(result);
        } catch (e) {
            throw new Exceptions.BillQuery("failed to deserialize BitPay server response (Bill) : " + e.message, e.apiCode);
        }
    }

    public async getBills(status: string | null): Promise<BillInterface> {
        const params = {'token': this.tokenContainer.getToken(Facade.Merchant)};
        if (status) {
            params['status'] = status;
        }

        try {
            const result = await this.bitPayClient.get("bills", params, true);
            return <BillInterface>JSON.parse(result);
        } catch (e) {
            throw new Exceptions.BillQuery("failed to deserialize BitPay server response (Bill) : " + e.message, e.apiCode);
        }
    }

    public async update(bill: BillInterface, billId: string): Promise<BillInterface> {
        try {
            const result = await this.bitPayClient.put("bills/" + billId, bill);
            return <BillInterface>JSON.parse(result);
        } catch (e) {
            throw new Exceptions.BillUpdate("failed to deserialize BitPay server response (Bill) : " + e.message, e.apiCode);
        }
    }

    public async deliver(billId: string, billToken: string, signRequest: boolean): Promise<Boolean> {
        const params = {'token': billToken};

        try {
            const result =  await this.bitPayClient.post("bills/" + billId + "/deliveries", params, signRequest)
            return (<string>JSON.parse(result) == "Success");
        } catch (e) {
            throw new Exceptions.BillDelivery("failed to deserialize BitPay server response (Bill) : " + e.message, e.apiCode);
        }
    }
}