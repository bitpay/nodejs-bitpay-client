export interface ItemInterface {
    description: string | null;
    price: number | null;
    quantity: number | null;
}

export class Item implements ItemInterface {
    description: string | null;
    price: number | null;
    quantity: number | null;

    public constructor(price: number, quantity: number, description: string) {
        this.price = price;
        this.quantity = quantity;
        this.description = description;
    }
}
