export interface ItemInterface {

    id: string;
    description: string;
    price: number;
    int: string;
}

export class Item implements ItemInterface {
    description: string;
    id: string;
    int: string;
    price: number;

    public constructor() {

    }
}
