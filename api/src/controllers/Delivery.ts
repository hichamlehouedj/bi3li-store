import { Types } from 'mongoose';
import { logger } from '../config/logger.js';
import { serializeBodyProduct, sendNotification, addRowInGoogleSheets, sendEventFacebook } from '../helpers/index.js';
import { Delivery, DeliveryCompany, Pixel, User, DeliveryPrice } from '../models/index.js';
import axios from 'axios';
import { socket } from '../index.js';

export const delivery = async (req, res) => {
    try {
        const id = req.params.id;
        
        const delivery = await Delivery.aggregate([
            {$match: {
                _id: new Types.ObjectId(id),
                $or: [
                    { idProduct: { $exists: true } },
                    { idLandingProduct: { $exists: true } }
                ]
            }},
            {$lookup: {
                from: "products",
                localField: "idProduct",
                foreignField: "_id",
                as: "product"
            }},
            {$lookup: {
                from: "landingproducts",
                localField: "idLandingProduct",
                foreignField: "_id",
                as: "landingProduct"
            }},
            {$addFields: {
                "product": { $arrayElemAt: ["$product", 0] },
                "landingProduct": { $arrayElemAt: ["$landingProduct", 0] }
            }},
            {$project: {
                "idProduct": 0,
                "idLandingProduct": 0
            }}
        ]);

        if (delivery.length > 0) {
            res.json(delivery[0]).status(200).send();
        } else {
            res.json(null).status(200).send();
        }

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}
export const allDelivery = async (req, res) => {
    try {
        const status = req.params.status;
        const {page, limit, sort} = req.query
        let totalRows = 0;
        
        const deliveries = await Delivery.aggregate([
            {$match: {
                $or: [
                    { idProduct: { $exists: true } },
                    { idLandingProduct: { $exists: true } }
                ]
            }},
            {$lookup: {
                from: "products",
                localField: "idProduct",
                foreignField: "_id",
                as: "product"
            }},
            {$lookup: {
                from: "landingproducts",
                localField: "idLandingProduct",
                foreignField: "_id",
                as: "landingProduct"
            }},
            {$addFields: {
                "product": { $arrayElemAt: ["$product", 0] },
                "landingProduct": { $arrayElemAt: ["$landingProduct", 0] }
            }},
            {$project: {
                "idProduct": 0,
                "idLandingProduct": 0
            }}
        ])
        
        res.json(deliveries).status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export  const allDeliveryByStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const {page, limit, sort} = req.query
        let totalRows = 0;

        let where = [
            {$lookup: {
                from: "products",
                localField: "idProduct",
                foreignField: "_id",
                as: "product"
            }},
            {$lookup: {
                from: "landingproducts",
                localField: "idLandingProduct",
                foreignField: "_id",
                as: "landingProduct"
            }},
            {$addFields: {
                "product": { $arrayElemAt: ["$product", 0] },
                "landingProduct": { $arrayElemAt: ["$landingProduct", 0] }
            }},
            {$project: { "idProduct": 0, "idLandingProduct": 0 }},
            {$sort: { createdAt: sort ? parseInt(sort) : -1 } },
            {$skip: ((page ? parseInt(page) : 1) - 1) * (limit ? parseInt(limit) : 20) },
            {$limit: limit ? parseInt(limit) : 20}
        ]

        if (status !== null && status !== undefined && status !== "") {
            //@ts-ignore
            where.unshift({$match: {
                status,
                $or: [
                    { idProduct: { $exists: true } },
                    { idLandingProduct: { $exists: true } }
                ]
            }})

            totalRows = await Delivery.count({status})
        } else {
            //@ts-ignore
            where.unshift({$match: {
                $or: [
                    { idProduct: { $exists: true } },
                    { idLandingProduct: { $exists: true } }
                ]
            }})
            totalRows = await Delivery.count()
        }
        

        //@ts-ignore
        const deliveries = await Delivery.aggregate(where);
        let totalPages = Math.ceil(totalRows / (limit ? parseInt(limit) : 20));

        res.json({
            data: deliveries,
            meta: {
                totalRows,
                total: totalPages,
                current_page: page ? parseInt(page) : 1,
                next_page: page ? parseInt(page) + 1 : 2,
                per_page: page ? (parseInt(page) - 1) > 0 ? parseInt(page) - 1 : 1 : 1,
                last_page: totalPages,
            }
        }).status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


export  const deliveryBySearch = async (req, res) => {
    try {
        const {status, search} = req.params;
        
        const delivery = await Delivery.aggregate([
            {$match: {
                status,
                $and: [
                    {$or: [
                        { fullName: { $regex: search, $options: "i" } },
                        { phone: search },
                        { state: search },
                        { city: search },
                        { typeFee: search },
                        { address: search }
                    ]},
                    {$or: [
                        { idProduct: { $exists: true } },
                        { idLandingProduct: { $exists: true } }
                    ]}
                ]
            }},
            {$lookup: {
                from: "products",
                localField: "idProduct",
                foreignField: "_id",
                as: "product"
            }},
            {$lookup: {
                from: "landingproducts",
                localField: "idLandingProduct",
                foreignField: "_id",
                as: "landingProduct"
            }},
            {$addFields: {
                "product": { $arrayElemAt: ["$product", 0] },
                "landingProduct": { $arrayElemAt: ["$landingProduct", 0] }
            }},
            {$project: { "idProduct": 0, "idLandingProduct": 0 }}
        ]);

        res.json(delivery).status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}
export  const deliveryExport = async (req, res) => {
    try {
        const status = req.params.status;
        const type = req.params.type;

        const {start, end} = req.query

        let where = [
            {$lookup: {
                from: "products",
                localField: "idProduct",
                foreignField: "_id",
                as: "product"
            }},
            {$lookup: {
                from: "landingproducts",
                localField: "idLandingProduct",
                foreignField: "_id",
                as: "landingProduct"
            }},
            {$addFields: {
                "product": { $arrayElemAt: ["$product", 0] },
                "landingProduct": { $arrayElemAt: ["$landingProduct", 0] }
            }},
            {$project: { "idProduct": 0, "idLandingProduct": 0 }}
        ]

        if (type !== null && type !== undefined && type == "all") {
            //@ts-ignore
            where.unshift({$match: {
                status,
                $or: [
                    { idProduct: { $exists: true } },
                    { idLandingProduct: { $exists: true } }
                ]
            }})
        } else if (type == "between") {
            //@ts-ignore
            where.unshift({$match: {
                status,
                createdAt: { $gte: new Date(start), $lt: new Date(end) },
                $or: [
                    { idProduct: { $exists: true } },
                    { idLandingProduct: { $exists: true } }
                ]
            }})
        } else {
            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

            //@ts-ignore
            where.unshift({$match: {
                status,
                createdAt: { $gte: new Date(firstDayOfMonth), $lt: new Date(lastDayOfMonth) },
                $or: [
                    { idProduct: { $exists: true } },
                    { idLandingProduct: { $exists: true } }
                ]
            }})
        }
        
        console.log({match: where[0]})
        

        //@ts-ignore
        const deliveries = await Delivery.aggregate(where);

        res.json(deliveries).status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


export const createDelivery = async (req, res) => {
    try {
        const content = req.body

        let delivery = await Delivery.create({
            ...content
        })

        if (delivery !== null) {
            let where: any = { phone: content.phone, status: "abandoned" }
            if ("idProduct" in content) {
                where = { ...where, idProduct: content.idProduct }
            } else if ("idLandingProduct" in content) {
                where = { ...where, idLandingProduct: content.idLandingProduct }
            }


            let orderAbandoned = await Delivery.find(where, {_id: 1})
            for (let i = 0; i < orderAbandoned.length; i++) {
                const element = orderAbandoned[i];
                const deleteO = await Delivery.deleteOne({
                    _id: element._id
                })
                
                console.log({deleteO})
            }
        }

        if (delivery !== null) {
            const pixels = await Pixel.find({name: "Api Conversion"});
            for (let i = 0; i < pixels.length; i++) {
                const pixel = pixels[i];
                if ("token" in pixel && "apiKey" in pixel && pixel.token !== "" && pixel.apiKey !== "") {
                    await sendEventFacebook(
                        pixel.apiKey,
                        pixel.token,
                        delivery._id,
                        delivery.phone,
                        {
                            "name": delivery.fullName,
                            "phone": delivery.phone,
                            "order-id": delivery._id,
                            "value": delivery.price * delivery.quantity,
                            "currency": "DZD"
                        }
                    )
                }
            }
        }

        const deliveryProduct = await Delivery.aggregate([
            {$match: {
                _id: delivery._id,
                $or: [
                    { idProduct: { $exists: true } },
                    { idLandingProduct: { $exists: true } }
                ]
            }},
            {$lookup: {
                from: "products",
                localField: "idProduct",
                foreignField: "_id",
                as: "product"
            }},
            {$lookup: {
                from: "landingproducts",
                localField: "idLandingProduct",
                foreignField: "_id",
                as: "landingProduct"
            }},
            {$addFields: {
                "product": { $arrayElemAt: ["$product", 0] },
                "landingProduct": { $arrayElemAt: ["$landingProduct", 0] }
            }},
            {$project: {
                "idProduct": 0,
                "idLandingProduct": 0
            }}
        ]);

        if (deliveryProduct.length > 0) {
            await addRowInGoogleSheets([
                [
                    deliveryProduct?.[0]?.product?.name,
                    deliveryProduct?.[0]?.fullName,
                    deliveryProduct?.[0]?.phone,
                    deliveryProduct?.[0]?.price * deliveryProduct?.[0]?.quantity,
                    deliveryProduct?.[0]?.quantity,
                    deliveryProduct?.[0]?.status  === "pending" ? "قيد الانتظار" :
                        deliveryProduct?.[0]?.status === "confirmed" ? "مؤكد" :
                        deliveryProduct?.[0]?.status === "closed" ? "مرفوض" :
                        deliveryProduct?.[0]?.status === "abandoned" ? "طلب متروك" : null,
                    deliveryProduct?.[0]?.createdAt,
                    deliveryProduct?.[0]?.typeFee === "home_fee" ? "للمنزل" :
                        deliveryProduct?.[0]?.typeFee === "desk_fee" ? "للمكتب" : null,
                    deliveryProduct?.[0]?.state,
                    deliveryProduct?.[0]?.city,
                    deliveryProduct?.[0]?.address
                ]
            ])
        }
        
        await socket.newOrder("", deliveryProduct)
        await sendNotification(deliveryProduct)
        
        res.json(delivery).status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}
export const updateDelivery = async (req, res) => {
    try {
        const id = req.params.id;
        const content = req.body
        const addToDeliveryCompany: boolean = req.body.addToDeliveryCompany || false
        const deliveryCompanyId = content.deliveryCompany
        if("deliveryCompany" in content) delete content.deliveryCompany
        
        let result = null
        
        if(Object.keys(content).length > 0) {
            console.log("if 01")
            const deliveryProduct = await Delivery.aggregate([
                {$match: {
                    _id: new Types.ObjectId(id),
                    $or: [
                        { idProduct: { $exists: true } },
                        { idLandingProduct: { $exists: true } }
                    ]
                }},
                {$lookup: {
                    from: "products",
                    localField: "idProduct",
                    foreignField: "_id",
                    as: "product"
                }},
                {$lookup: {
                    from: "landingproducts",
                    localField: "idLandingProduct",
                    foreignField: "_id",
                    as: "landingProduct"
                }},
                {$addFields: {
                    "product": { $arrayElemAt: ["$product", 0] },
                    "landingProduct": { $arrayElemAt: ["$landingProduct", 0] }
                }},
                {$project: {
                    "idProduct": 0,
                    "idLandingProduct": 0
                }}
            ]);

            result = await Delivery.findByIdAndUpdate(id, content, {rawResult: true});
            
            if (result?.ok === 1) {
                    console.log("if 02")
                const delivery = deliveryProduct[0]

                if (addToDeliveryCompany === true && "status" in content && content?.status === "confirmed") {
                    console.log("if 03")
                    const deliveryCompany = await DeliveryCompany.findById(deliveryCompanyId);
                    const user = await User.findOne({ role: "admin" });

                    if (user !== null && user !== undefined && deliveryCompany !== null && deliveryCompany !== undefined && deliveryCompany.apiKey !== "" && deliveryCompany.apiToken !== "") {
                        console.log("if 04")
                        const orderRes = await addOrderInYalidine(deliveryCompany.apiKey, deliveryCompany.apiToken, {
                            id: id,
                            from_wilaya: user.wilaya,
                            firstname: delivery.fullName.split(" ")[0],
                            familyname: delivery.fullName.split(" ")[1],
                            phone: delivery.phone,
                            address: delivery.address || "",
                            description: delivery.product !== null && delivery.product !== undefined ? delivery?.product?.name : delivery.landingProduct !== null && delivery.landingProduct !== undefined ? delivery?.landingProduct?.name : "",
                            price: delivery.price * delivery.quantity,
                            declared_value: delivery.price * delivery.quantity,
                            freeshipping: delivery.deliveryPrice !== undefined ? delivery.deliveryPrice == 0 ? true : delivery.deliveryPrice : false,
                            is_stopdesk: delivery.typeFee === "desk_fee",
                            to_wilaya: delivery.state,
                            to_commune: delivery.city
                        })

                        if (orderRes !== null) {
                            console.log("if 05")
                            const order: any = Object.values(orderRes)[0];
                            await Delivery.findByIdAndUpdate(id, {
                                deliveryCompany: {
                                    name: "Yalidine",
                                    status: order.success ? "success" : "failed",
                                    trackingCode: order.tracking,
                                    bordereau: order.label
                                }
                            })
                        } else {
                            await Delivery.findByIdAndUpdate(id, {
                                deliveryCompany: {
                                    name: "Yalidine",
                                    status: "failed",
                                    trackingCode: "",
                                    bordereau: ""
                                }
                            })
                        }
                    }
                }
            }
        }

        res.json({status: result?.ok === 1 }).status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}
export const deleteDelivery = async (req, res) =>  {
    try {
        const id = req.params.id;
        // @ts-ignore
        const {modifiedCount} = await Delivery?.deleteById(id)

        res.json({status: modifiedCount >= 1}).status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


export const resendOrderInYalidine = async (req, res) => {
    try {
        const id = req.params.id;
        
        let result = null
        const deliveryProduct = await Delivery.aggregate([
            {$match: {
                _id: new Types.ObjectId(id),
                $or: [
                    { idProduct: { $exists: true } },
                    { idLandingProduct: { $exists: true } }
                ]
            }},
            {$lookup: {
                from: "products",
                localField: "idProduct",
                foreignField: "_id",
                as: "product"
            }},
            {$lookup: {
                from: "landingproducts",
                localField: "idLandingProduct",
                foreignField: "_id",
                as: "landingProduct"
            }},
            {$addFields: {
                "product": { $arrayElemAt: ["$product", 0] },
                "landingProduct": { $arrayElemAt: ["$landingProduct", 0] }
            }},
            {$project: {
                "idProduct": 0,
                "idLandingProduct": 0
            }}
        ]);
        
        if (deliveryProduct !== null && deliveryProduct.length > 0) {
            const delivery = deliveryProduct[0]

            if (["completed", "confirmed"].includes(delivery?.status.toLowerCase())) {
                const deliveryCompany = await DeliveryCompany.findOne({ name: "yalidine" });
                const user = await User.findOne({ role: "admin" });

                if (user !== null && user !== undefined && deliveryCompany !== null && deliveryCompany !== undefined && deliveryCompany.apiKey !== "" && deliveryCompany.apiToken !== "") {
                    const orderRes = await addOrderInYalidine(deliveryCompany.apiKey, deliveryCompany.apiToken, {
                        id: id,
                        from_wilaya: user.wilaya,
                        firstname: delivery.fullName.split(" ")[0],
                        familyname: delivery.fullName.split(" ")[1],
                        phone: delivery.phone,
                        address: delivery.address,
                        description: delivery.product !== null ? delivery.product.name : delivery.landingProduct !== null ? delivery.landingProduct.name : "",
                        price: delivery.price * delivery.quantity,
                        declared_value: delivery.price * delivery.quantity,
                        freeshipping: delivery.deliveryPrice !== undefined ? delivery.deliveryPrice == 0 ? true : delivery.deliveryPrice : false,
                        is_stopdesk: delivery.typeFee === "desk_fee",
                        to_wilaya: delivery.state,
                        to_commune: delivery.city
                    })

                    if (orderRes !== null) {
                        const order: any = Object.values(orderRes)[0];
                        await Delivery.findByIdAndUpdate(id, {
                            deliveryCompany: {
                                name: "Yalidine",
                                status: order.success ? "success" : "failed",
                                trackingCode: order.tracking,
                                bordereau: order.label
                            }
                        })
                        result = true
                    } else {
                        await Delivery.findByIdAndUpdate(id, {
                            deliveryCompany: {
                                name: "Yalidine",
                                status: "failed",
                                trackingCode: "",
                                bordereau: ""
                            }
                        })
                        result = false
                    }
                }
            }
        }

        res.json({status: !!result }).status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


interface dataOrder {
    id: string;
    from_wilaya: string;
    firstname: string;
    familyname: string;
    phone: string;
    address: string;
    to_commune: string;
    to_wilaya: string;
    description: string;
    price: number;
    declared_value: number;
    freeshipping: boolean;
    is_stopdesk: boolean;
}
const addOrderInYalidine = async (apiKey: string, apiToken: string, data: dataOrder) =>  {
    const {id, from_wilaya, firstname, familyname, phone, address, to_commune, to_wilaya, description, price, declared_value, freeshipping, is_stopdesk} = data

    try {
        let data =  {
            order_id: id,
            from_wilaya_name: from_wilaya,
            firstname,
            familyname: familyname === undefined || familyname === "" ? firstname : familyname,
            contact_phone: phone,
            address,
            to_commune_name: to_commune,
            to_wilaya_name: to_wilaya,
            product_list: description,
            price, //سعر المنتج مضروب في العدد
            declared_value,//سعر المنتج مضروب في العدد
            freeshipping,
            is_stopdesk,


            do_insurance: false,
            height: 10,
            width: 10,
            length: 10,
            weight: 1,
            has_exchange: false,
        };

        let newData = [{...data}]

        if (is_stopdesk) {
            let wilayaID = ""
            for (let index = 0; index < wilayas.length; index++) {
                const element = wilayas[index];
                if(element.name === to_wilaya) {
                    wilayaID = element.id
                    break;
                }
            }
            
            const centers = await axios.get(`https://api.yalidine.app/v1/centers/?wilaya_id=${wilayaID}`, {
                method: 'get',
                maxBodyLength: Infinity,
                headers: {
                    'X-API-ID': apiKey,
                    'X-API-TOKEN': apiToken,
                    'Content-Type': 'application/json'
                }
            })
            
            let stopdesk = centers?.data?.data?.[0]

            for (let index = 0; index < centers?.data?.data?.length; index++) {
                const element = centers?.data?.data?.[index];
                if(element.commune_name === to_commune) {
                    stopdesk = element
                    break;
                }
            }

            newData = [{
                ...data,
                //@ts-ignore
                stopdesk_id: stopdesk?.center_id,
                to_commune_name: stopdesk?.commune_name
            }]
        }
          
        const res = await axios.post('https://api.yalidine.app/v1/parcels/', JSON.stringify(newData), {
            method: 'post',
            maxBodyLength: Infinity,
            headers: {
                'X-API-ID': apiKey,
                'X-API-TOKEN': apiToken,
                // 'X-API-ID': '09712476872108341641',
                // 'X-API-TOKEN': 'hYxqAins8rH5zGXv7WLRaNoQsjcHxKp1VEpDSevdcIVtUB4ZNwbLJwuykYPWf5K4',
                'Content-Type': 'application/json'
            }
        })
        

        return res.status === 200 ? res.data : null
    } catch (error) {
        console.log(error?.response?.data);
        return null
    }
}

export const communes = async (req, res) =>  {
    try {
        const id = req.params.id;

        const response = await axios.get(`https://api.yalidine.app/v1/communes/?wilaya_id=${id}`, {
            maxBodyLength: Infinity,
            headers: {
                'X-API-ID': '09712476872108341641',
                'X-API-TOKEN': 'hYxqAins8rH5zGXv7WLRaNoQsjcHxKp1VEpDSevdcIVtUB4ZNwbLJwuykYPWf5K4'
            }
        })

        res.json(response.data).status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}
export const allWilayas = async (req, res) =>  {
    try {
        const response = await axios.request({
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://api.yalidine.app/v1/wilayas/',
            headers: {
                'X-API-ID': '09712476872108341641',
                'X-API-TOKEN': 'hYxqAins8rH5zGXv7WLRaNoQsjcHxKp1VEpDSevdcIVtUB4ZNwbLJwuykYPWf5K4'
            }
        })
        

        res.json(response.data).status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}
export const deliveryFees = async (req, res) =>  {
    try {
        const {wilaya_id} = req.params;
        
        const deliveryPrices = await DeliveryPrice.findOne({
            code: wilaya_id
        });
        
        res.json(deliveryPrices).status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


const wilayas = [
    {"id":"1","code":"1","name":"Adrar"}, 
    {"id":"2","code":"2","name":"Chlef"}, 
    {"id":"3","code":"3","name":"Laghouat"}, 
    {"id":"4","code":"4","name":"Oum El Bouaghi"},
    {"id":"5","code":"5","name":"Batna"},
    {"id":"6","code":"6","name":"Bejaia"},
    {"id":"7","code":"7","name":"Biskra"},
    {"id":"8","code":"8","name":"Bechar"},
    {"id":"9","code":"9","name":"Blida"},
    {"id":"10","code":"10","name":"Bouira"},
    {"id":"11","code":"11","name":"Tamanrasset"},
    {"id":"12","code":"12","name":"Tbessa"},
    {"id":"13","code":"13","name":"Tlemcen"},
    {"id":"14","code":"14","name":"Tiaret"},
    {"id":"15","code":"15","name":"Tizi Ouzou"},
    {"id":"16","code":"16","name":"Alger"},
    {"id":"17","code":"17","name":"Djelfa"},
    {"id":"18","code":"18","name":"Jijel"},
    {"id":"19","code":"19","name":"Setif"},
    {"id":"20","code":"20","name":"Saeda"},
    {"id":"21","code":"21","name":"Skikda"},
    {"id":"22","code":"22","name":"Sidi Bel Abbes"},
    {"id":"23","code":"23","name":"Annaba"},
    {"id":"24","code":"24","name":"Guelma"},
    {"id":"25","code":"25","name":"Constantine"},
    {"id":"26","code":"26","name":"Medea"},
    {"id":"27","code":"27","name":"Mostaganem"},
    {"id":"28","code":"28","name":"M'Sila"},
    {"id":"29","code":"29","name":"Mascara"},
    {"id":"30","code":"30","name":"Ouargla"},
    {"id":"31","code":"31","name":"Oran"},
    {"id":"32","code":"32","name":"El Bayadh"},
    {"id":"33","code":"33","name":"Illizi"},
    {"id":"34","code":"34","name":"Bordj Bou Arreridj"},
    {"id":"35","code":"35","name":"Boumerdes"},
    {"id":"36","code":"36","name":"El Tarf"},
    {"id":"37","code":"37","name":"Tindouf"},
    {"id":"38","code":"38","name":"Tissemsilt"},
    {"id":"39","code":"39","name":"El Oued"},
    {"id":"40","code":"40","name":"Khenchela"},
    {"id":"41","code":"41","name":"Souk Ahras"},
    {"id":"42","code":"42","name":"Tipaza"},
    {"id":"43","code":"43","name":"Mila"},
    {"id":"44","code":"44","name":"Ain Defla"},
    {"id":"45","code":"45","name":"Naama"},
    {"id":"46","code":"46","name":"Ain Temouchent"},
    {"id":"47","code":"47","name":"Ghardaefa"},
    {"id":"48","code":"48","name":"Relizane"}
]