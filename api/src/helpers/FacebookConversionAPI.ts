import axios from "axios";
import { createHash } from 'crypto';

export const sendEventFacebook = async (pixelId: string, accessToken: string, orderId: string, phone: string, dataOrder: any) => {
    try {
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const sourceUrl = `https://tajer1.qafilaty.com/order/failed/product/${orderId}`
        let data = {
            "data": [{
                "event_name": "Purchase",
                "event_time": timestamp,
                "event_source_url": sourceUrl,
                "action_source": "website",
                "user_data": {
                    "ph": createHash('sha256').update(phone).digest('hex')
                },
                "custom_data": dataOrder
            }],
            "access_token": accessToken
        }
        
        const res = await axios.post(`https://graph.facebook.com/v19.0/${pixelId}/events`, data)
    
        console.log({res: res.data});
        return res.status === 200 ? res.data : null
    } catch (error) {
        console.log(error?.response);
        return null
    }
}