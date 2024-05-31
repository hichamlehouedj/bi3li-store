import {User, Client } from "../models/index.js";
import { logger } from "../config/logger.js";


export const isExistUser = async (id: string) => {
    try {
        if (!id) return false

        const user = await User.findById(id).exec();

        if (user) return user
        else return false
    } catch (error) {
        logger.error(error)
    }
}

export const isExistClient = async (id: string) => {
    try {
        if (!id) return false

        const client = await Client.findById(id).exec();

        if (client) return client
        else return false
    } catch (error) {
        logger.error(error)
    }
}

export const alreadyExistUser = async (email: string, phone: string) => {
    try {
        const user = await User.findOne({$or: [{email}, {phone}]}).exec();

        if (user) {
            if (user.email === email && user.phone === phone) return {"message": "account already exists", "code": "ACCOUNT_ALREADY_EXIST"}
            else if (user.email === email) return {"message": "email already exists", "code": "EMAIL_ALREADY_EXIST"}
            else if (user.phone === phone) return {"message": "phone already exists", "code": "PHONE_ALREADY_EXIST"}
        }
        else return false
    } catch (error) {
        logger.error(error)
    }
}

export const alreadyExistClient = async (email: string, phone: string) => {
    try {
        const client = await Client.findOne({email, phone}).exec();

        if (client) {
            if (client.email === email && client.phone === phone) return {"message": "account already exists", "code": "ACCOUNT_ALREADY_EXIST"}
            else if (client.email === email) return {"message": "email already exists", "code": "EMAIL_ALREADY_EXIST"}
            else if (client.phone === phone) return {"message": "phone already exists", "code": "PHONE_ALREADY_EXIST"}
        }
        else return false
    } catch (error) {
        logger.error(error)
    }
}

export const sameUserAgent = (tokenAgent: string, userAgent: any) => {
    try {
        if (!userAgent || !tokenAgent || userAgent === "" || tokenAgent === "") return null

        let useragent = `${userAgent.browser}: ${userAgent.version}, ${userAgent.platform}: ${userAgent.os}, ${userAgent.source}`

        if (useragent !== tokenAgent) return null
        else return true
    } catch (error) {
        logger.error(error)
    }
}
