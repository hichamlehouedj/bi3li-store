import {Schema, model, Types} from 'mongoose';

import MongooseDelete from 'mongoose-delete'

import {LandingProductI } from "../Interfaces/index.js";


export const LandingProductSchema = new Schema<LandingProductI>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    link: { type: String, required: true },
    cost: { type: Number, required: true },
    image: { type: String, required: true },
    freeShipping: { type: Boolean },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    offers: [{
        name:  { type: String},
        price: { type: Number },
        quantity: { type: Number },
        freeShipping: { type: Boolean }
    }]
}, {
    timestamps: true
});

LandingProductSchema.plugin(MongooseDelete, { overrideMethods: true, deleted: true, deletedAt: true });

export const LandingProduct = model<LandingProductI>('LandingProduct', LandingProductSchema);