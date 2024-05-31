import {SoftDeleteDocument} from "mongoose-delete";
import {Types} from "mongoose";

export interface  UserI extends SoftDeleteDocument {
    profilePicture: string | null
    name: string | null
    email: string | null

    phone: string | null

    password: string
    role: string | null

    activation: boolean | null
    emailVerify: boolean | null

    
    codeVerify: string | null
    
    firebaseToken: string | null

    whatsapp: string | null
    wilaya: string | null

    idStore?: Types.ObjectId

    sheetsCredentials: {
        spreadsheetId?: string | null;
        access_token?: string | null;
        refresh_token?: string | null;
        expiry_date?: number | null;
    }

}