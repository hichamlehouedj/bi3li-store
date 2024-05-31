import {SoftDeleteDocument} from "mongoose-delete";
import {Types} from "mongoose";

export interface DeliveryPriceI extends SoftDeleteDocument {
    name: string;
    code: string;
    desk_fee: number;
    home_fee: number;
}