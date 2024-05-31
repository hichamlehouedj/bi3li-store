import {SoftDeleteDocument} from "mongoose-delete";

export interface  ImagesProductI extends SoftDeleteDocument {
    name: string | null
    alt: string | null
}