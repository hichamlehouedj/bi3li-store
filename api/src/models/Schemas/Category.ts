import {Schema, model, Types} from 'mongoose';
import MongooseDelete from 'mongoose-delete'
import {CategoryI} from "../Interfaces/index.js";

export const CategorySchema = new Schema<CategoryI>({
    name: { type: String, required: true },
    image: { type: String },
    subCategories: [{ type: String, required: true }]
}, {
    timestamps: true
});

CategorySchema.plugin(MongooseDelete, { overrideMethods: true, deleted: true, deletedAt: true });

export const Category = model<CategoryI>('Category', CategorySchema);