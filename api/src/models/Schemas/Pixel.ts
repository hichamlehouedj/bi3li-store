import { Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete'

import {PixelI} from "../Interfaces/index.js";

export const PixelSchema = new Schema<PixelI>({
    name: { type: String, required: true },
    apiKey: { type: String, required: true },
    token: { type: String }
}, {
    timestamps: true
});

PixelSchema.plugin(MongooseDelete, { overrideMethods: true, deleted: true, deletedAt: true });

export const Pixel = model<PixelI>('Pixel', PixelSchema);