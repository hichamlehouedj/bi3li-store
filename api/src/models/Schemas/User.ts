import { Schema, model } from 'mongoose';

import MongooseDelete from 'mongoose-delete'

import {UserI} from "../Interfaces/index.js";

export const UserSchema = new Schema<UserI>({
    name: { type: String, required: true },
    email: { type: String, required: true },

    phone: { type: String, required: true },

    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "confirmed", "client"] },

    activation: { type: Boolean, required: true },
    emailVerify: { type: Boolean, required: true },

    codeVerify: { type: String },

    firebaseToken: { type: String },

    whatsapp: { type: String },
    wilaya: { type: String },

    sheetsCredentials: {
        spreadsheetId: { type: String },
        access_token: { type: String },
        refresh_token: { type: String },
        expiry_date: { type: Number }
    }
}, {
    timestamps: true
});

UserSchema.plugin(MongooseDelete, { overrideMethods: true, deleted: true, deletedAt: true });

export const User = model<UserI>('User', UserSchema);