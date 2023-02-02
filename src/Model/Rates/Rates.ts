import {Client} from "../../Client";
import RateQueryException from "../../Exceptions/RateQueryException";
import {RateClient} from "../../Client/RateClient";

interface RateInterface {
    Name: string;
    cryptoCode: string;
    currencyPair: string;
    code: string;
    rate: number;
}

class Rates {
    private rates: RateInterface[];

    public constructor(rates: RateInterface[]) {
        this.rates = this.castRatesObj(rates);
    }

    public getRates() {
        return this.rates;
    }

    public getRate(currencyCode: string):Number {
        let val = 0;
        this.rates.forEach(function (rate) {
            if (rate.code === currencyCode) {
                val = rate.rate;
                return val;
            }
        });

        return val;
    }

    public async update(rateClient: RateClient) {
        try {
            let rates = await rateClient.getRates();
            this.rates = rates.getRates();
        } catch (e) {
            throw new RateQueryException(e);
        }
    }

    private castRatesObj(ratesObj:RateInterface[]|string): RateInterface[] {
        try {
            if (typeof ratesObj === 'string' || ratesObj instanceof String) {
                ratesObj = JSON.parse(ratesObj.toString());
            }

            return <RateInterface[]>ratesObj;
        } catch (e) {
            throw new RateQueryException(e);
        }
    }
}

export {Rates, RateInterface}
