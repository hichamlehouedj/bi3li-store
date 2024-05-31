import sgMail from "@sendgrid/mail";
import 'dotenv/config'

import path from "path";
import {fileURLToPath} from "url";
import {readFile} from "fs/promises";
import {createPDF} from "./PDF.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const maileVerificationMail = (token: string) => {
    const url = `http://localhost:3000/login/verification/${token}`;

    return `
        <body style="width: 90%;  text-align: center; background: #eee; padding: 80px 20px; font-family: 'Changa', sans-serif;">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Changa:wght@300&display=swap" rel="stylesheet">
            <h1 style="text-align: center;  margin: 50px auto 30px;" >التحقق من البريد الالكتروني</h1>
            <h5 style="font-size: 18px; margin-bottom: 50px;" >اضغط على زر تحقق للتحقق من انك انت صاحب الحساب</h5>
            <a href="${url}" style="background-color: #64C7C2; color: #fff; padding: 10px 45px; font-size: 20px; text-decoration: none;" class="btn">تحقق</a>
        </body>
    `
}

const maileForgetPassword = (token: string) => {
    const url = `https://sample-store-api.qafilaty.com/api/users/change-password/?token=${token}`;

    return `
        <body style="width: 90%;  text-align: center; background: #eee; padding: 80px 20px; font-family: 'Changa', sans-serif;">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Changa:wght@300&display=swap" rel="stylesheet">
            <h1 style="text-align: center;  margin: 50px auto 30px;" >تغيير كلمة المرور</h1>
            <h5 style="font-size: 18px; margin-bottom: 50px;" >قم بنسخ رمز التحقق ولصقه في حقل التحقق لتتمكن من إنشاء كلمة مرور جديدة</h5>
            <div style="background-color: #64C7C2; color: #fff; padding: 10px 45px; font-size: 20px; text-decoration: none;" class="btn">${token}</div>
        </body>
    `
}
export const verificationMail = async (mail: {to: string; subject: string; token: string;}) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
        from: {
            email: 'support@atlaeq.com',
            name: 'Support Atlaeq'
        },
        to: mail.to,
        subject: mail.subject,
        html: maileVerificationMail(mail.token)
    }

    try {
        return await sgMail.send(msg)
    }  catch (error) {
        console.log('error =========> ')
        console.error(error)
        return false
    }
};

export const forgetPasswordMail = async (mail: {to: string; subject: string; token: string;}) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
        from: {
            email: 'support@atlaeq.com',
            name: 'Support Atlaeq'
        },
        to: mail.to,
        subject: mail.subject,
        html: maileForgetPassword(mail.token),
    }

    try {
        return await sgMail.send(msg)
    }  catch (error) {
        console.log('error =========> ')
        console.error(error)
        return false
    }
};

export const createMail = async (mail: {to: string; subject: string; content: string;}) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
        from: {
            email: 'support@atlaeq.com',
            name: 'Support Atlaeq'
        },
        to: mail.to,
        subject: mail.subject,
        html: mail.content,

    }


    const pathFile = path.join(__dirname,   `./../../uploads/example.pdf`);
    const pdfFile = await readFile(pathFile);
    // const base64PDF = await createPDF();

    try {
        return await sgMail.send({
            from: {
                email: 'support@atlaeq.com',
                name: 'Support Atlaeq'
            },
            to: mail.to,
            subject: mail.subject,
            html: mail.content,
            // attachments: [{
            //     // @ts-ignore
            //     content: pdfFile.toString("base64"),
            //     type: "application/pdf",
            //     filename: "example.pdf",
            //     disposition: "attachment",
            //     contentId: "inline",
            // }]
        })
    }  catch (error) {
        console.log('error =========> ')
        console.error(error)
        return false
    }
};