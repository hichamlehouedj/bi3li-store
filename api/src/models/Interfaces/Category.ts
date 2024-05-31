import {SoftDeleteDocument} from "mongoose-delete";
import {Types} from "mongoose";

export interface CategoryI extends SoftDeleteDocument {
    name: string;
    image: string;
    subCategories: string[];
}