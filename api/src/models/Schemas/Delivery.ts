import {Schema, model, Types} from 'mongoose';

import MongooseDelete from 'mongoose-delete'

import {DeliveryI} from "../Interfaces/index.js";

export const DeliverySchema = new Schema<DeliveryI>({
    fullName: { type: String, required: false },
    phone: { type: String, required: true },
    state: { type: String, required: false },
    city: { type: String, required: false },
    price: { type: Number, required: false },
    quantity: { type: Number, required: false },

    typeFee: { type: String, required: false },
    address: { type: String, required: false },
    deliveryPrice: { type: Number, required: false },

    sizes: [{ type: String, required: false }],
    colors: [{ type: String, required: false }],

    status: { type: String, required: true, default: "pending", enum: ["pending", "confirmed", "closed", "abandoned"] },
    idProduct: { type: Schema.Types.ObjectId, ref: 'Product' },
    idLandingProduct: { type: Schema.Types.ObjectId, ref: 'LandingProduct' },

    deliveryCompany: {
        name: { type: String, required: false },
        status: { type: String, required: false },
        trackingCode: { type: String, required: false },
        bordereau: { type: String, required: false }
    }
}, {
    timestamps: true
});

DeliverySchema.plugin(MongooseDelete, { overrideMethods: true, deleted: true, deletedAt: true });

export const Delivery = model<DeliveryI>('Delivery', DeliverySchema);