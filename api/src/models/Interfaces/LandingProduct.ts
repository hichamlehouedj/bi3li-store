import {SoftDeleteDocument} from "mongoose-delete";

export interface LandingProductI extends SoftDeleteDocument {
    link: string | null;
    price: number | null;
    name: string | null;
    cost: number | null;
    image: string | null;
    freeShipping: boolean | null;

    sizes?: string[];
    colors?: string[];
    offers?: {
        name?: string;
        price?: number;
        quantity?: number;
        freeShipping?: boolean;
    }[]
}