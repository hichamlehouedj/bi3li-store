import { Schema, model } from 'mongoose';

import MongooseDelete from 'mongoose-delete'

import {DeliveryProductI} from "../Interfaces/index.js";

export const DeliveryProductSchema = new Schema<DeliveryProductI>({
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    idProduct: { type: Schema.Types.ObjectId, ref: 'Product' },
}, {
    timestamps: true
});

DeliveryProductSchema.plugin(MongooseDelete, { overrideMethods: true, deleted: true, deletedAt: true });

// export const Brand = model<BrandI>('Cart', brandSchema);