import { Types } from 'mongoose';
import { logger } from '../config/logger.js';
import { Category } from '../models/index.js';
import axios from 'axios';
import { UploadFile } from '../helpers/Upload.js';

export const category = async (req, res) => {
    try {
        const id = req.params.id;
        
        const category = await Category.findById(id)
        res.json(category).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(404).json(error);
    }
}
export const allCategory = async (req, res) => {
    try {
        const category = await Category.find();
        
        res.json(category).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(404).json(error);
    }
}

export const createCategory = async (req, res) => {
    try {
        let image = null
        const body = req.body
        
        const content = {
            name: body.name !== 'null' ? body.name : null,
            subCategories: body.subCategories !== 'null' && body.subCategories !== undefined 
                ? (body?.subCategories.length > 0 ? body?.subCategories.split(",") : [])
                : null
        }
        // if(content.name == null) delete content.name

        if (req.files && req.files !== null && req.files !== undefined) {
            if ("image" in req.files && req.files.image !== null && req.files.image !== undefined) {
                image = await UploadFile(req.files.image)
            }
        }

        let category = await Category.create({
            ...content,
            image
        })

        res.json(category).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(404).json(error);
    }
}
export const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body
        
        const content = {
            name: body.name !== 'null' ? body.name : null,
            subCategories: body.subCategories !== 'null' && body.subCategories !== undefined 
                ? (body?.subCategories.length > 0 ? body?.subCategories.split(",") : [])
                : null
        }
        if(content.name == null) delete content.name
        if(content.subCategories == null) delete content.subCategories

        if (req.files && req.files !== null && req.files !== undefined) {
            if ("image" in req.files && req.files.image !== null && req.files.image !== undefined) {
                let image = await UploadFile(req.files.image)
                await Category.findByIdAndUpdate(id, {image}, {rawResult: true});
            }
        }

        let {ok} = await Category.findByIdAndUpdate(id, content, {rawResult: true});
        
        
        const category = await Category.find();

        res.json(category).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(404).json(error);
    }
}
export const deleteCategory = async (req, res) =>  {
    try {
        const id = req.params.id;
        // @ts-ignore
        const {modifiedCount} = await Category?.deleteById(id)

        const category = await Category.find();

        res.json(category).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(404).json(error);
    }
}