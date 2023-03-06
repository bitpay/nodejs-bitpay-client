export interface CurrencyInterface {
  code: string;
  name: string;
  symbol: string;
  precision: number;
  decimals: number;
}

export class Currency implements CurrencyInterface {
  code: string;
  name: string;
  symbol: string;
  precision: number;
  decimals: number;
}
