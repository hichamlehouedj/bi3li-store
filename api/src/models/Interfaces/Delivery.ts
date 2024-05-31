import {SoftDeleteDocument} from "mongoose-delete";
import {Types} from "mongoose";
// import {DeliveryProductI} from "./DeliveryProduct.js";

export interface DeliveryI extends SoftDeleteDocument {
    fullName: string | null
    phone: string | null
    state: string | null
    city: string | null

    price: number | null
    quantity: number | null

    status: string | null

    typeFee: string | null
    address: string | null
    deliveryPrice: number | null

    sizes: string[]
    colors: string[]

    idProduct?:   Types.ObjectId
    idLandingProduct?:   Types.ObjectId

    deliveryCompany: {
        name: string | null
        status: string | null
        trackingCode: string | null
        bordereau: string | null
    }
}