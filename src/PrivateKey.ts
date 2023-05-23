export class PrivateKey {
  private readonly value: string;

  constructor(value: string) {
    value = value.replace('"', '');
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
