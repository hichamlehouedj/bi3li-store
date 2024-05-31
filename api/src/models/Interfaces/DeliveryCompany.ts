import {SoftDeleteDocument} from "mongoose-delete";
import {Types} from "mongoose";

export interface DeliveryCompanyI extends SoftDeleteDocument {
    name: string;
    apiKey: string;
    apiToken: string;
    logo: string;
}