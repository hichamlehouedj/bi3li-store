import { Types } from 'mongoose';
import { Delivery } from '../models/index.js';


export const createCartAbandoned = async (req, res) => {
    try {
        const content = req.body

        let where: any = { phone: content.phone, status: "abandoned" }
        if ("idProduct" in content) {
            where = { ...where, idProduct: content.idProduct }
        } else if ("idLandingProduct" in content) {
            where = { ...where, idLandingProduct: content.idLandingProduct }
        }


        let orderAbandoned = await Delivery.find(where, {_id: 1})
        if(orderAbandoned.length == 0) {
            let cartAbandoned = await Delivery.create({
                ...content,
                status: "abandoned"
            })
    
            res.json(cartAbandoned).status(200).send();
            return;
        }
        res.json(null).status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}