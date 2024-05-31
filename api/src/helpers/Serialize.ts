import lodash from 'lodash';

const { pick } = lodash;

import {Types} from "mongoose";

interface ProductI {
    name: string | null
    price: number | null
    priceAfterDiscount: number | null
    cost: number | null
    quantity: number | null
    weight: number | null
    shortDescription: string | null
    description: string | null

    notRequireDelivery: boolean | null
    freeShipping: boolean | null
    posting: boolean | null
    
    thumbnail?: string
    imagesProduct?: string[]
} 


export const serializeBodyProduct = (body: any) => {
    const data = {
        name: body.name !== 'null' && body.name !== undefined ? body.name : null,
        price: body.price !== 'null' && body.price !== undefined ? parseFloat(body.price) : null,
        priceAfterDiscount: body.priceAfterDiscount !== 'null' && body.priceAfterDiscount !== undefined ? parseFloat(body.priceAfterDiscount) : null,
        cost: body.cost !== 'null' && body.cost !== undefined ? parseFloat(body.cost) : null,
        weight: body.weight !== 'null' && body.weight !== undefined ? parseFloat(body.weight) : null,
        shortDescription: body.shortDescription !== 'null' && body.shortDescription !== undefined ? body.shortDescription : null,
        description: body.description !== 'null' && body.description !== undefined ? body.description : null,
        notRequireDelivery: body.notRequireDelivery !== 'null' && body.notRequireDelivery !== undefined ? body.notRequireDelivery === 'true' : null,
        freeShipping: body.freeShipping !== 'null' && body.freeShipping !== undefined ? body.freeShipping === 'true' : null,
        posting: body.posting !== 'null' && body.posting !== undefined ? body.posting === 'true' : null,
        categories: body?.categories !== 'null' && body.categories !== undefined ? body?.categories.split(",") : null,
        subCategories: body?.subCategories !== 'null' && body.subCategories !== undefined ? body?.subCategories.split(",") : null,

        sizes: body?.sizes !== 'null' && body.sizes !== undefined ? (body?.sizes.length > 0 ? body?.sizes.split(",") : []) : null,
        colors: body?.colors !== 'null' && body.colors !== undefined ? (body?.colors.length > 0 ?  body?.colors.split(",") : []) : null,
        upsell: body.upsell !== 'null' && body.upsell !== undefined ? body.upsell === 'true' : null,
        offers: body.offers !== undefined ? JSON.parse(body?.offers) : null,
        rating: body.rating !== 'null' && body.rating !== undefined ? parseFloat(body.rating) : null,
    }
    if(data.name == null) delete data.name
    if(data.price == null || isNaN(data.price)) delete data.price
    if(data.priceAfterDiscount == null) delete data.priceAfterDiscount
    if(data.cost == null || isNaN(data.cost)) delete data.cost
    if(data.weight == null || isNaN(data.weight)) delete data.weight
    if(data.shortDescription == null) delete data.shortDescription
    if(data.description == null) delete data.description
    if(data.notRequireDelivery == null) delete data.notRequireDelivery
    if(data.freeShipping == null) delete data.freeShipping
    if(data.posting == null) delete data.posting
    if(data.categories == null) delete data.categories
    if(data.subCategories == null) delete data.subCategories
    if(data.sizes == null) delete data.sizes
    if(data.colors == null) delete data.colors
    if(data.upsell == null) delete data.upsell
    if(data.offers == null) delete data.offers
    if(data.rating == null || isNaN(data.rating)) delete data.rating

    return data
};

export const serializeBodyLandingProduct = (body: any) => {
    const data = {
        name: body.name !== 'null' ? body.name : null,
        price: body.price !== 'null' ? parseFloat(body.price) : null,
        cost: body.cost !== 'null' ? parseFloat(body.cost) : null,
        link: body.link !== 'null' ? body.link : null,
        freeShipping: body.freeShipping !== 'null' ? body.freeShipping === 'true' : null,

        sizes: body?.sizes !== 'null' && body.sizes !== undefined ? (body?.sizes.length > 0 ? body?.sizes.split(",") : []) : null,
        colors: body?.colors !== 'null' && body.colors !== undefined ? (body?.colors.length > 0 ?  body?.colors.split(",") : []) : null,
        offers: body.offers !== undefined ? JSON.parse(body?.offers) : null,
    }
    
    console.log()
    if(data.name == null) delete data.name
    if(data.price == null || isNaN(data.price)) delete data.price
    if(data.cost == null || isNaN(data.cost)) delete data.cost
    if(data.link == null) delete data.link
    if(data.freeShipping == null) delete data.freeShipping
    if(data.sizes == null) delete data.sizes
    if(data.colors == null) delete data.colors
    if(data.offers == null) delete data.offers

    return data
};


export const serializeUser = (user) => pick(user, [
    'id',
    'name',
    'phone',
    'email',
    'role',
    'personal_picture',
    'activation',
    'email_verify',
    'display_language',
    'notifications',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'id_service'
]);