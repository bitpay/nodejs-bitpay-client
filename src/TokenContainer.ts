import { Facade } from './Facade';
import { BitPayExceptionProvider } from './Exceptions/BitPayExceptionProvider';

export class TokenContainer {
  private readonly data: Map<string, string>;

  constructor(tokens?: object) {
    this.data = new Map<string, string>();
    if (tokens !== undefined) {
      (Object.keys(tokens) as (keyof typeof tokens)[]).forEach((key) => {
        this.add(key, String(tokens[key]));
      });
    }
  }

  /**
   *
   * @param key
   * @returns string
   * @throws BitPayGenericException BitPayGenericException class
   */
  public getToken(key: string): string {
    if (!this.data.has(key)) {
      BitPayExceptionProvider.throwGenericExceptionWithMessage('There is no token for the specified key : ' + key);
    }

    return this.data.get(key);
  }

  /**
   *
   * @param token
   */
  public addPos(token: string): void {
    this.data.set(Facade.Pos, token);
  }

  /**
   *
   * @param token
   */
  public addMerchant(token: string): void {
    this.data.set(Facade.Merchant, token);
  }

  /**
   *
   * @param token
   */
  public addPayout(token: string): void {
    this.data.set(Facade.Payout, token);
  }

  /**
   *
   * @param facade
   * @returns
   */
  public isTokenExist(facade: Facade): boolean {
    return this.data.has(facade);
  }

  /**
   *
   * @param facade
   * @param token
   */
  private add(facade: string, token: string): void {
    this.data.set(facade, token);
  }
}
