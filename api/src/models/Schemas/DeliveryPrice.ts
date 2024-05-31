import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete'

import {DeliveryPriceI} from "../Interfaces/index.js";

export const DeliveryPriceSchema = new Schema<DeliveryPriceI>({
    name: { type: String, required: true },
    code: { type: String, required: true },
    desk_fee: { type: Number, required: true, default: 0 },
    home_fee: { type: Number, required: true, default: 0 }
}, {
    timestamps: true
});

DeliveryPriceSchema.plugin(MongooseDelete, { overrideMethods: true, deleted: true, deletedAt: true });

export const DeliveryPrice = model<DeliveryPriceI>('DeliveryPrice', DeliveryPriceSchema);