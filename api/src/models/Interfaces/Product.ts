import {SoftDeleteDocument} from "mongoose-delete";
import {ImagesProductI} from "../Interfaces/index.js";
import {Types} from "mongoose";

export interface ProductI extends SoftDeleteDocument {
    name: string | null
    price: number | null
    priceAfterDiscount: number | null
    cost: number | null
    weight: number | null
    shortDescription: string | null
    description: string | null

    notRequireDelivery: boolean | null
    freeShipping: boolean | null
    posting: boolean | null
    
    thumbnail?: string
    imagesProduct?: string[]

    idStore?: Types.ObjectId
    idBrand?: Types.ObjectId
    categories?: string[]
    subCategories?: string[]

    sizes?: string[]
    colors?: string[]
    upsell?: boolean
    offers?: {
        name?: string;
        price?: number;
        quantity?: number;
        freeShipping?: boolean;
    }[]
    rating?: number;
}