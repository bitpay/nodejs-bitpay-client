export class ParamsRemover {

    public static removeNullValuesFromObject(obj: Object): Object {
        return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
    }
}