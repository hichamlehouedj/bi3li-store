import axios from "axios";

interface dataOrder {
    id: string;
    from_wilaya: string;
    fullName: string;
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
const addOrder = async (apiKey: string, apiToken: string, data: dataOrder) =>  {
    const {id, from_wilaya, fullName, phone, address, to_commune, to_wilaya, description, price, declared_value, freeshipping, is_stopdesk} = data

    try {
        let data =  {
            order_id: id,
            from_wilaya_name: from_wilaya,
            fullName,
            contact_phone: phone,
            address: address || "",
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

        let data2 = {
            customer_name: fullName,
            customer_phone: phone,
            destination_text: address,
            note_to_driver: "",
            express: "",
            external_order_id: "",
            product_price: "",
            delivery_type: "",
            commune: "",
            details: {
                product: "",
                quantity: ""
            }
        }

        let newData = [{...data}]

        // if (is_stopdesk) {
        //     let wilayaID = ""
        //     for (let index = 0; index < wilayas.length; index++) {
        //         const element = wilayas[index];
        //         if(element.name === to_wilaya) {
        //             wilayaID = element.id
        //             break;
        //         }
        //     }
            
        //     const centers = await axios.get(`https://api.yalidine.app/v1/centers/${wilayaID}`, {
        //         method: 'get',
        //         maxBodyLength: Infinity,
        //         headers: {
        //             'X-API-ID': apiKey,
        //             'X-API-TOKEN': apiToken,
        //             'Content-Type': 'application/json'
        //         }
        //     })

        //     let stopdesk = centers?.data?.data?.[0]

        //     for (let index = 0; index < centers?.data?.data?.length; index++) {
        //         const element = centers?.data?.data?.[index];
        //         if(element.commune_name === to_commune) {
        //             stopdesk = element
        //             break;
        //         }
        //     }
            

        //     newData = [{
        //         ...data,
        //         //@ts-ignore
        //         stopdesk_id: stopdesk?.center_id,
        //         to_commune_name: stopdesk?.commune_name
        //     }]
        // }

        // const res = await axios.post('https://import-export-orders-as6qwsolmq-ew.a.run.app/api//delivery/orders/', JSON.stringify(newData), {
        //     method: 'post',
        //     maxBodyLength: Infinity,
        //     headers: {
        //         'X-API-ID': apiKey,
        //         'X-API-TOKEN': apiToken,
        //         // 'X-API-ID': '09712476872108341641',
        //         // 'X-API-TOKEN': 'hYxqAins8rH5zGXv7WLRaNoQsjcHxKp1VEpDSevdcIVtUB4ZNwbLJwuykYPWf5K4',
        //         'Content-Type': 'application/json'
        //     }
        // })

        return null//res.status === 200 ? res.data : null
    } catch (error) {
        console.log(error?.response?.data);
        return null
    }
}