import { logger } from '../config/logger.js';
import { UploadFile, UploadMultiFile, serializeBodyProduct } from '../helpers/index.js';
import { Product, Delivery } from '../models/index.js';

export const product = async (req, res) => {
    try {
        const id = req.params.id;
        
        const product = await Product.findById(id)
        res.json(product).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
}
export const allProduct = async (req, res) => {
    try {
        const products = await Product.find();

        res.json(products).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
}

export const allPostingProduct = async (req, res) => {
    try {
        const products = await Product.find({
            "posting": true
        });

        res.json(products).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
export const allUpSellProduct = async (req, res) => {
    try {
        const {categories, subCategories} = req.query
        let where = []

        if (categories !== undefined) {
            where.push({ categories: { $in: categories } })
            where.push({ categories: { $exists: false } })
        } else if (subCategories !== undefined) {
            where.push({ subCategories: { $in: subCategories } })
            where.push({ subCategories: { $exists: false } })
        }

        const products = await Product.find({
            posting: true,
            $or: where
        });

        res.json(products).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export const createProduct = async (req, res) => {
    try {
        let thumbnail = null
        let imagesProduct = []
        const content = serializeBodyProduct(req.body)
        
        if (req.files && req.files !== null && req.files !== undefined) {
            if ("thumbnail" in req.files && req.files.thumbnail !== null && req.files.thumbnail !== undefined) {
                thumbnail = await UploadFile(req.files.thumbnail)
            }
            if ("imagesProduct" in req.files && req.files.imagesProduct !== null && req.files.imagesProduct !== undefined) {
                if (req.files.imagesProduct.length > 0) {
                    imagesProduct = await UploadMultiFile(req.files.imagesProduct)
                } else {
                    let image = await UploadFile(req.files.imagesProduct)
                    imagesProduct.push(image)
                }
            }
        }

        let product = await Product.create({
            ...content,
            thumbnail,
            imagesProduct
        })

        res.json(product).status(200).send();
    } catch (error) {
        console.error(error);
        res.json(error).status(500).send();
    }
}
export const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const content = serializeBodyProduct(req.body)
        const oldImagesProduct = req.body.oldImagesProduct
        
        if (req.files && req.files !== null && req.files !== undefined) {
            if ("thumbnail" in req.files && req.files.thumbnail !== null && req.files.thumbnail !== undefined) {
                let thumbnail = await UploadFile(req.files.thumbnail)
                await Product.findByIdAndUpdate(id, {thumbnail}, {rawResult: true});
            }
            if ("imagesProduct" in req.files && req.files.imagesProduct !== null && req.files.imagesProduct !== undefined) {
                let imagesProduct = []
                if (req.files.imagesProduct.length > 0) {
                    imagesProduct = await UploadMultiFile(req.files.imagesProduct)
                } else {
                    let image = await UploadFile(req.files.imagesProduct)
                    imagesProduct.push(image)
                }
                let newImagesProduct = [...imagesProduct]

                if (oldImagesProduct !== null && oldImagesProduct !== undefined && oldImagesProduct !== "") {
                    newImagesProduct = [...oldImagesProduct.split(","), ...newImagesProduct]
                }
                
                await Product.findByIdAndUpdate(id, {
                    imagesProduct: newImagesProduct
                }, {rawResult: true});
            } else {
                if (oldImagesProduct !== null && oldImagesProduct !== undefined && oldImagesProduct !== "") {
                    await Product.findByIdAndUpdate(id, {
                        imagesProduct: oldImagesProduct.split(",")
                    }, {rawResult: true});
                }
            }
        } else {
            if (oldImagesProduct !== null && oldImagesProduct !== undefined && oldImagesProduct !== "") {
                await Product.findByIdAndUpdate(id, {
                    imagesProduct: oldImagesProduct.split(",")
                }, {rawResult: true});
            }
        }
        
        let result = null
        
        if(Object.keys(content).length > 0) {
            result = await Product.findByIdAndUpdate(id, content, {rawResult: true});
        }

        res.json({status: result?.ok === 1 }).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
export const deleteProduct = async (req, res) =>  {
    try {
        const id = req.params.id;
        // @ts-ignore
        const {modifiedCount} = await Product?.deleteById(id)

        res.json({status: modifiedCount >= 1}).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
}

export const deleteImageFromProduct = async (req, res) =>  {
    try {
        const {idProduct, image} = req.body;
        const product = await Product.findById(idProduct)

        let newImages = []
        for (let index = 0; index < product?.imagesProduct?.length; index++) {
            const element = product?.imagesProduct[index];
            if (element !== image) {
                newImages.push(element)
            }
        }
        // @ts-ignore
        const {ok} = await Product.findByIdAndUpdate(idProduct, {
            imagesProduct: newImages
        }, {rawResult: true});

        res.json({status: ok == 1}).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}