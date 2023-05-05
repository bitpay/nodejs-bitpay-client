export class ParamsRemover {
  public static removeNullValuesFromObject(obj: object): object {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
  }
}
