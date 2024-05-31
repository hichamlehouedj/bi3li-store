import {SoftDeleteDocument} from "mongoose-delete";
import {Types} from "mongoose";

export interface  StoreI extends SoftDeleteDocument {
    topBar: {
        color: string | null
        background: string | null
        content: string | null
        show: boolean | null
    }
    logo: string | null
    information: {
        phone: string | null
        email: string | null
        facebook: string | null
        tiktok: string | null
        instagram: string | null
        shortDescription: string | null
        address: string | null
        
        whatsapp: string | null
        title: string | null
        textColor: string | null
        backgroundColor: string | null
    }
    header: string[]
}