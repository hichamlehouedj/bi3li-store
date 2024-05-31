import { Schema, model } from 'mongoose';

import MongooseDelete from 'mongoose-delete'

import {StoreI} from "../Interfaces/index.js";

export const StoreSchema = new Schema<StoreI>({
    topBar: {
        color: { type: String },
        background: { type: String },
        content: { type: String },
        show: { type: Boolean, default: true }
    },
    logo: { type: String },
    information: {
        phone: { type: String },
        email: { type: String },
        facebook: { type: String },
        tiktok: { type: String },
        instagram: { type: String },
        shortDescription: { type: String },
        address: { type: String },
        
        
        whatsapp: { type: String },
        title: { type: String },
        textColor: { type: String },
        backgroundColor: { type: String }
    },
    header: [{ type: String }]
}, {
    timestamps: true
});

StoreSchema.plugin(MongooseDelete, { overrideMethods: true, deleted: true, deletedAt: true });


export const Store = model<StoreI>('Store', StoreSchema);
