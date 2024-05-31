import { Types } from 'mongoose';
import { logger } from '../config/logger.js';
import { DeliveryCompany } from '../models/index.js';
import axios from 'axios';
import { UploadFile } from '../helpers/Upload.js';

export const deliveryCompany = async (req, res) => {
    try {
        const id = req.params.id;
        
        const deliveryCompany = await DeliveryCompany.findById(id)
        res.json(deliveryCompany).status(200).send();
    } catch (error) {
        logger.error(error)
        res.status(500).send(error);
    }
}
export const allDeliveryCompany = async (req, res) => {
    try {
        const deliveryCompany = await DeliveryCompany.find();
        
        res.json(deliveryCompany).status(200).send();
    } catch (error) {
        logger.error(error)
        res.status(500).send(error);
    }
}

export const hasDeliveryCompany = async (req, res) => {
    try {
        let status = false
        const deliveryCompany = await DeliveryCompany.find();
        
        if (deliveryCompany.length > 0) {
            if (deliveryCompany[0].apiKey !== null && deliveryCompany[0].apiKey !== undefined && 
                deliveryCompany[0].apiKey !== "" && deliveryCompany[0].apiToken !== null && 
                deliveryCompany[0].apiToken !== undefined && deliveryCompany[0].apiToken !== "") {
                status = true
            }
        }

        res.json({status}).status(200).send();
    } catch (error) {
        logger.error(error)
        res.status(500).send(error);
    }
}


export const createDeliveryCompany = async (req, res) => {
    try {
        const body = req.body
        
        const content = {
            name: body.name !== undefined &&  body.name !== 'null' ? body.name : null,
            apiKey: body.apiKey !== undefined &&  body.apiKey !== 'null' ? body.apiKey : null,
            apiToken: body.apiToken !== undefined &&  body.apiToken !== 'null' ? body.apiToken : null,
            logo: body.logo !== undefined &&  body.logo !== 'null' ? body.logo : null
        }

        let deliveryCompany = await DeliveryCompany.create({...content})
        

        res.json(deliveryCompany).status(200).send();
    } catch (error) {
        logger.error(error)
        res.status(500).send(error);
    }
}
export const updateDeliveryCompany = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body
        
        const content = {
            name: body.name !== undefined &&  body.name !== 'null' ? body.name : null,
            apiKey: body.apiKey !== undefined &&  body.apiKey !== 'null' ? body.apiKey : null,
            apiToken: body.apiToken !== undefined &&  body.apiToken !== 'null' ? body.apiToken : null,
            logo: body.logo !== undefined &&  body.logo !== 'null' ? body.logo : null
        }
        if(content.name == null) delete content.name
        if(content.apiKey == null) delete content.apiKey
        if(content.apiToken == null) delete content.apiToken
        if(content.logo == null) delete content.logo

        let {ok} = await DeliveryCompany.findByIdAndUpdate(id, content, {rawResult: true});

        res.json({status: ok === 1 }).status(200).send();
    } catch (error) {
        logger.error(error)
        res.status(500).send(error);
    }
}
export const deleteDeliveryCompany = async (req, res) =>  {
    try {
        const id = req.params.id;
        // @ts-ignore
        const {modifiedCount} = await DeliveryCompany?.deleteById(id)

        res.json({status: modifiedCount >= 1}).status(200).send();
    } catch (error) {
        logger.error(error)
        res.status(500).send(error);
    }
}