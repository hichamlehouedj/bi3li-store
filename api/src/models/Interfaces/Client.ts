import {SoftDeleteDocument} from "mongoose-delete";
import {Types} from "mongoose";

export interface ClientI extends SoftDeleteDocument {
    profilePicture: string | null
    name: string | null
    email: string | null

    phone: string | null
    dateBirth: string | null

    address: string | null
    gander: string | null

    password: string

    activation: boolean | null
    emailVerify: boolean | null

    note: string | null


    idStore?: Types.ObjectId
}