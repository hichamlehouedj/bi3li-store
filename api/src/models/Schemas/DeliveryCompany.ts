import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete'

import {DeliveryCompanyI} from "../Interfaces/index.js";

export const DeliveryCompanySchema = new Schema<DeliveryCompanyI>({
    name: { type: String, required: true },
    apiKey: { type: String, required: true },
    apiToken: { type: String, required: true },
    logo: { type: String, required: false }
}, {
    timestamps: true
});

DeliveryCompanySchema.plugin(MongooseDelete, { overrideMethods: true, deleted: true, deletedAt: true });

export const DeliveryCompany = model<DeliveryCompanyI>('DeliveryCompany', DeliveryCompanySchema);