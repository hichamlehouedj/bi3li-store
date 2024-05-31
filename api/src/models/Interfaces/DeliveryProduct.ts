import {SoftDeleteDocument} from "mongoose-delete";
import {Types} from "mongoose";

export interface DeliveryProductI extends SoftDeleteDocument {
    price: number | null
    quantity: number | null
    idProduct?:   Types.ObjectId
}