export class GuidGenerator {
    public execute(): string {
        return new Date().getTime().toString();
    }
}