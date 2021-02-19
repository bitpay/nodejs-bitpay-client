import {Client} from "../../Client";
import RateQueryException from "../../Exceptions/RateQueryException";

interface RateInterface {
    Name: string;
    cryptoCode: string;
    currencyPair: string;
    code: string;
    rate: number;
}

class Rates{
    private _rates: RateInterface[];
    private _client: Client;

    public constructor(rates: RateInterface[], client: Client) {
        this._rates = this.castRatesObj(rates);
        this._client = client;
    }

    private castRatesObj(ratesObj:RateInterface[]|string) {
        try {
            if (typeof ratesObj === 'string' || ratesObj instanceof String) {
                ratesObj = JSON.parse(ratesObj.toString());
            }

            return <RateInterface[]>ratesObj;
        } catch (e) {
            throw new RateQueryException(e);
        }
    }

    public GetRates() {
        return this._rates;
    }

    public async Update() {
        try {
            this._rates = await Promise.resolve(this._client.GetRates());
        } catch (e) {
            throw new RateQueryException(e);
        }
    }

    public GetRate(currencyCode: string):Number {
        let val = 0;
        this._rates.forEach(function (rate) {
            if (rate.code === currencyCode) {
                val = rate.rate;
                return val;
            }
        });

        return val;
    }
}

export {Rates, RateInterface}
