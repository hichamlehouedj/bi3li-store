import { Schema, model } from 'mongoose';

import MongooseDelete from 'mongoose-delete'

import {ImagesProductI} from "../Interfaces/index.js";

export const ImagesProductSchema = new Schema<ImagesProductI>({
    name: { type: String, required: true,  },
    alt: { type: String, required: true }
}, {
    timestamps: true
});

ImagesProductSchema.plugin(MongooseDelete, { overrideMethods: true, deleted: true, deletedAt: true });

// export const Brand = model<BrandI>('Cart', brandSchema);