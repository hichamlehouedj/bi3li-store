import { logger } from '../config/logger.js';
import { serializeBodyLandingProduct } from '../helpers/Serialize.js';
import { UploadFile } from '../helpers/Upload.js';
import { LandingProduct } from '../models/index.js';
import RandToken from 'rand-token';
const { uid, generator } = RandToken
import path from "path";
import {fileURLToPath} from "url";
import { readFile } from 'node:fs/promises';
import { encode } from "blurhash";
import Jimp from "jimp";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const landingProduct = async (req, res) => {
    try {
        const link = req.params.link;
        
        const landingProduct = await LandingProduct.findOne({link})
        
        res.json({
            //@ts-ignore
            ...landingProduct?._doc
        }).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
export const allLandingProduct = async (req, res) => {
    try {
        const landingProducts = await LandingProduct.find();
        
        res.json(landingProducts).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export const createLandingProduct = async (req, res) => {
    try {
        let landingImage = null
        const content = serializeBodyLandingProduct(req.body)
        
        if (req.files && req.files !== null && req.files !== undefined) {
            if ("image" in req.files && req.files.image !== null && req.files.image !== undefined) {
                landingImage = await UploadFile(req.files.image)
                
                const pathName = path.join(__dirname,   `./../../uploads/${landingImage}`);
                const pathName2 = path.join(__dirname,   `./../../uploads/${landingImage}.webp`);

                const imageJimp = await Jimp.read(pathName);
                await imageJimp.quality(20).writeAsync(pathName2);
                // await sharp(pathName).webp({quality: 20}).toFile(pathName2)
            }
        }

        let landingProduct = await LandingProduct.create({
            ...content,
            link: uid(10),
            image: landingImage
        })

        res.json(landingProduct).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
export const updateLandingProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const content = serializeBodyLandingProduct(req.body)
        
        if (req.files && req.files !== null && req.files !== undefined) {
            if ("image" in req.files && req.files.image !== null && req.files.image !== undefined) {
                let image = await UploadFile(req.files.image)
                
                
                const pathName = path.join(__dirname,   `./../../uploads/${image}`);
                const pathName2 = path.join(__dirname,   `./../../uploads/${image}.webp`);

                const imageJimp = await Jimp.read(pathName);
                await imageJimp.quality(20).writeAsync(pathName2);
        
                // await sharp(pathName).webp({quality: 20}).toFile(pathName2)
                
                await LandingProduct.findByIdAndUpdate(id, {image}, {rawResult: true});
            }
        }

        let result = null
        
        if(Object.keys(content).length > 0) {
            result = await LandingProduct.findByIdAndUpdate(id, content, {rawResult: true});
        }

        res.json({status: result?.ok === 1 }).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
export const deleteLandingProduct = async (req, res) =>  {
    try {
        const id = req.params.id;
        // @ts-ignore
        const {modifiedCount} = await LandingProduct?.deleteById(id)

        res.json({status: modifiedCount >= 1}).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}