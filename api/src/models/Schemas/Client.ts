import {Schema, model, Types} from 'mongoose';

import MongooseDelete from 'mongoose-delete'

import {ClientI} from "../Interfaces/index.js";


export const ClientSchema = new Schema<ClientI>({
    profilePicture: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },

    phone: { type: String, required: true },

    dateBirth: { type: String, required: true },
    address: { type: String, required: true },
    gander: { type: String, required: true },

    password: { type: String, required: false },

    activation: { type: Boolean, required: true },
    emailVerify: { type: Boolean, required: true },

    idStore: { type: Schema.Types.ObjectId, ref: 'Store' }
}, {
    timestamps: true
});

ClientSchema.plugin(MongooseDelete, { overrideMethods: true, deleted: true, deletedAt: true });

export const Client = model<ClientI>('Client', ClientSchema);
