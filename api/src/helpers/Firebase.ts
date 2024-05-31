import { error } from "console"
import {getMessaging} from 'firebase-admin/messaging';
import { User } from "../models/index.js";
import admin from 'firebase-admin';
import { initializeApp, applicationDefault, } from 'firebase-admin/app';
import path from "path";
var serviceAccount = path.join("/www/wwwroot/DEV_ENV/SampleStore/api/service-account-file.json");

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const sendNotification = async (data: any) => {
    const users = await User.find({ firebaseToken: { $ne: null } })
    let tokens = []

    for (let index = 0; index < users.length; index++) {
        const element = users[index];
        if ("firebaseToken" in element && element.firebaseToken !== null && element.firebaseToken != undefined && element.firebaseToken != "") {
            tokens.push(element.firebaseToken)
        }
    }
    
    console.log({tokens})

    try {
        if(tokens.length > 0) {
            const res = await firebaseAdmin.messaging().sendMulticast({
                tokens: tokens,
                notification: {
                    title: `🎉 طلب جديد من "${data[0].fullName}"`,
                    body: `${data[0].quantity} ${data[0]?.product?.name || data[0]?.landingProduct?.name} بمبلغ ${data[0].quantity * data[0].price} دج 💰`,
                    // imageUrl: "",
                },
                data: data.length > 0 ? {"data": JSON.stringify(data[0])} : null
            })
            
            console.log({responses: res.responses})
            console.log({"responses[0]": res.responses[0]})
            console.log({error: res.responses[0]?.error})
            
            return res
        } else {
            return false
        }
    } catch (err) {
        console.log("sendNotification", {err});
        return error(err)
    }
}