export interface WithHoldingsInterface {
  amount: number;
  code: string;
  description?: string;
  notes?: string;
  label?: string;
  bankCountry?: string;
}

export class WithHoldings implements WithHoldingsInterface {
  amount: number;
  code: string;
  description?: string;
  notes?: string;
  label?: string;
  bankCountry?: string;

  public constructor() {}
}
