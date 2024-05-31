import { logger } from '../config/logger.js';
import { Delivery, Product, Pixel, LandingProduct, DeliveryPrice, Store } from '../models/index.js';
import RandToken from 'rand-token';
import { UploadFile, UploadMultiFile } from '../helpers/Upload.js';
import Jimp from "jimp";
import path from "path";
import {fileURLToPath} from "url";

const { uid, generator } = RandToken

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const getStore = async (req, res) => {
    try {
        const store = await Store.find()
        res.json(store.length > 0 ? store[0] : null).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export const allStatistics = async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);


        const confirmedOrder = await Delivery.count({status: "confirmed"});
        const closedOrder = await Delivery.count({status: "closed"});
        const pendingOrder = await Delivery.count({status: "pending"});

        const publishProduct = await Product.count({posting: true});
        const notPublishProduct = await Product.count({posting: false});

        const bestSellerOrder = await Delivery.aggregate([
            { $match: { status: "confirmed" } },
            { $group: { _id: "$idProduct", totalQuantity: { $sum: "$quantity" } } },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ]);

        let bestSellerProducts = []
        for (let index = 0; index < bestSellerOrder.length; index++) {
            const element = bestSellerOrder[index];
            const product = await Product.findById(element._id);
            if(product !== null) {
                bestSellerProducts.push({product, totalQuantity: element.totalQuantity})
            }
        }

        const bestSellerOrderLanding = await Delivery.aggregate([
            { $match: { status: "confirmed" } },
            { $group: { _id: "$idLandingProduct", totalQuantity: { $sum: "$quantity" } } },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ]);
        let bestSellerLandingProducts = []
        for (let index = 0; index < bestSellerOrderLanding.length; index++) {
            const element = bestSellerOrderLanding[index];
            const landingProduct = await LandingProduct.findById(element._id);
            if(landingProduct !== null) {
                bestSellerLandingProducts.push({landingProduct, totalQuantity: element.totalQuantity})
            }
        }

        const todayIncome = await Delivery.aggregate([
            {
                $match: {
                    status: "confirmed",
                    createdAt: { $gte: startOfToday, $lt: endOfToday }
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: { $multiply: ["$price", "$quantity"] } }
                }
            }
        ])

        const sales = await Delivery.aggregate([
            {$match: {status: "confirmed"}},
            {$group: {
                _id: null,
                totalSales: { $sum: { $multiply: ["$price", "$quantity"] } }
            }}
        ])
        const costs = await Delivery.aggregate([
            {$match: {status: "confirmed"}},
            {$lookup: {
                from: "products",
                localField: "idProduct",
                foreignField: "_id",
                as: "product"
            }},
            {$unwind: "$product"},
            {$group: {
                _id: null,
                totalCost: { $sum: { $multiply: ["$product.cost", "$quantity"] } }
            }}
        ])
        const costsDelivery = await Delivery.aggregate([
            {$match: {status: "confirmed"}},
            {$lookup: {
                from: "products",
                localField: "idProduct",
                foreignField: "_id",
                as: "product"
            }},
            {$unwind: "$product"},
            {$group: {
                _id: null,
                totalDeliveryCost: {
                    $sum: { $cond: { if: { $eq: ["$product.freeShipping", true] }, then: "$deliveryPrice", else: 0 } }
                }
            }}
        ])
        const netProfit = (
            (sales.length > 0 ? sales[0].totalSales : 0) - (
                (costs.length > 0 ? costs[0].totalCost : 0) + (costsDelivery.length > 0 ? costsDelivery[0].totalDeliveryCost : 0)
            )
        )
        
        res.json({
            products: {
                total: publishProduct + notPublishProduct,
                publish: publishProduct,
                notPublish: notPublishProduct
            },
            incomes: {
                sales: sales.length > 0 ? parseFloat(sales[0].totalSales.toFixed(2)): 0,
                todayIncome: todayIncome.length > 0 ? parseFloat(todayIncome[0].totalIncome.toFixed(2)) : 0,
                netProfit: parseFloat(netProfit.toFixed(2))
            },
            orders: {
                total: confirmedOrder + closedOrder + pendingOrder,
                confirmed: confirmedOrder,
                closed: closedOrder,
                pending: pendingOrder
            },
            bestSellerProducts,
            bestSellerLandingProducts
        }).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export const addTopBar = async (req, res) => {
    try {
        const content = req.body
        let findStore = await Store.find()

        if (findStore.length == 0) {
            let store = await Store.create({
                topBar: content
            })

            res.json({status: !!store}).status(200).send();
            return;
        } else {
            let {ok} = await Store.findByIdAndUpdate(findStore[0]._id, {
                topBar: content
            }, {rawResult: true});
    
            res.json({status: ok === 1 }).status(200).send();
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export const addHeader = async (req, res) => {
    try {
        let newImages = []
        const oldImages = req.body.oldImages
        let findStore = await Store.find()
        
        if (req.files && req.files !== null && req.files !== undefined) {
            if ("images" in req.files && req.files.images !== null && req.files.images !== undefined) {
                let images = []
                if (req.files.images.length > 0) {
                    images = await UploadMultiFile(req.files.images)
                } else {
                    let image = await UploadFile(req.files.images)
                    images.push(image)
                }
                newImages = [...images]

                // const pathName = path.join(__dirname,   `./../../uploads/${images}`);
                // const pathName2 = path.join(__dirname,   `./../../uploads/${images}.webp`);

                // const imageJimp = await Jimp.read(pathName);
                // await imageJimp.quality(20).writeAsync(pathName2);
            }
        }

        if (findStore.length == 0) {
            let store = await Store.create({
                header: newImages
            })

            res.json({status: !!store}).status(200).send();
            return;
        } else {
            let {ok} = await Store.findByIdAndUpdate(findStore[0]._id, {
                header: [...oldImages.split(","), ...newImages]
            }, {rawResult: true});
    
            res.json({status: ok === 1 }).status(200).send();
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export const updateStore = async (req, res) => {
    try {
        let newLogo = null
        const content = req.body
        let findStore = await Store.find()
        
        if (req.files && req.files !== null && req.files !== undefined) {
            if ("logo" in req.files && req.files.logo !== null && req.files.logo !== undefined) {
                newLogo = await UploadFile(req.files.logo)
                delete content.oldLogo
                if (findStore.length == 0) {
                    let store = await Store.create({ logo: newLogo, information: {...content} })
                    res.json({status: !!store}).status(200).send();
                    return;
                } else {
                    let {ok} = await Store.findByIdAndUpdate(findStore[0]._id, {logo: newLogo, information: {...content}}, {rawResult: true});
                    res.json({status: ok === 1 }).status(200).send();
                    return;
                }
            }
        } else {
            const oldLogo = content.oldLogo
            delete content.oldLogo
            if (findStore.length == 0) {
                let store = await Store.create({ information: {...content} })
                res.json({status: !!store}).status(200).send();
                return;
            } else {
                let {ok} = await Store.findByIdAndUpdate(findStore[0]._id, {logo: oldLogo, information: {...content}}, {rawResult: true});
                res.json({status: ok === 1 }).status(200).send();
                return;
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export const pixel = async (req, res) => {
    try {
        const id = req.params.id;
        
        const pixel = await Pixel.findById(id)
        res.json(pixel).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export const allPixels = async (req, res) => {
    try {
        const pixels = await Pixel.find();
        
        res.json(pixels).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}


export const createPixel = async (req, res) => {
    try {
        const content = req.body
        
        let pixel = await Pixel.create(content)

        res.json(pixel).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
export const updatePixel = async (req, res) => {
    try {
        const id = req.params.id;
        const content = req.body

        let {ok} = await Pixel.findByIdAndUpdate(id, content, {rawResult: true});

        res.json({status: ok === 1 }).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}
export const deletePixel = async (req, res) =>  {
    try {
        const id = req.params.id;
        // @ts-ignore
        const {modifiedCount} = await Pixel?.deleteById(id)

        res.json({status: modifiedCount >= 1}).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export const allDeliveryPrices = async (req, res) => {
    try {
        const deliveryPrices = await DeliveryPrice.find();
        
        res.json(deliveryPrices).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export const createDeliveryPrice = async (req, res) => {
    try {
        const content = req.body
        let result = 0

        for (let i = 0; i < content.length; i++) {
            const element = content[i];
            const id = element?._id
            delete element._id

            if (id !== undefined && id !== "") {
                let {ok, value, lastErrorObject} = await DeliveryPrice.findByIdAndUpdate(id, element, {rawResult: true});
                
                result = ok === 1 ? result++ : result
            } else {
                let deliveryPrice = await DeliveryPrice.create(element);
                
                result += deliveryPrice !== null ? 1 : 0
            }
        }

        res.json({status: result > 0 }).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}