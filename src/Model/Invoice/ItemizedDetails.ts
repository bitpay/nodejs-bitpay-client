export interface ItemizedDetailsInterface {
    amount: number;
    description: string;
    isFee: string;
}

export class ItemizedDetails implements ItemizedDetailsInterface{
    amount: number;
    description: string;
    isFee: string;

    public constructor(){

    }
}
