export interface CurrencyInterface {
  code: string;
  name: string;
  symbol: string;
  precision: number;
  decimals: number;
  plural: string;
  alts: string;
  minimum: number;
  sanctioned: boolean;
  displayCode?: string;
  chain?: string;
  maxSupply?: string;
}

export class Currency implements CurrencyInterface {
  code: string;
  name: string;
  symbol: string;
  precision: number;
  decimals: number;
  plural: string;
  alts: string;
  minimum: number;
  sanctioned: boolean;
  displayCode?: string;
  chain?: string;
  maxSupply?: string;
}
