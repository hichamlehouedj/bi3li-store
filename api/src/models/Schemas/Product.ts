import {Schema, model, Types} from 'mongoose';

import MongooseDelete from 'mongoose-delete'

import {ProductI } from "../Interfaces/index.js";
import {ImagesProductSchema} from "./ImagesProduct.js";
// import {Category} from "./ClassFirstLevel";


export const ProductSchema = new Schema<ProductI>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    priceAfterDiscount: { type: Number, required: true },
    cost: { type: Number, required: true },
    weight: { type: Number, required: true },
    shortDescription: { type: String },
    description: { type: String, required: false },

    notRequireDelivery: { type: Boolean },
    freeShipping: { type: Boolean },
    posting: { type: Boolean },


    thumbnail:  { type: String},
    imagesProduct:  [{ type: String}],

    idStore: { type: Schema.Types.ObjectId, ref: 'Store' },
    idBrand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    categories: [{ type: String }],
    subCategories: [{ type: String }],
    
    sizes: [{ type: String }],
    colors: [{ type: String }],
    upsell: { type: Boolean },
    offers: [{
        name:  { type: String},
        price: { type: Number },
        quantity: { type: Number },
        freeShipping: { type: Boolean }
    }],
    rating: { type: Number }
}, {
    timestamps: true
});

ProductSchema.plugin(MongooseDelete, { overrideMethods: true, deleted: true, deletedAt: true });

export const Product = model<ProductI>('Product', ProductSchema);