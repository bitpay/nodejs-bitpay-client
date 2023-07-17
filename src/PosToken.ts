export class PosToken {
  private readonly value: string;

  /**
   *
   * @param value
   */
  constructor(value: string) {
    this.value = value;
  }

  /**
   *
   * @returns string
   */
  public getValue(): string {
    return this.value;
  }
}
