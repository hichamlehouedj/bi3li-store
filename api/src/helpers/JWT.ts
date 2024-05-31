import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

const SECRET_JWT = process.env.SECRET_JWT
const { sign, verify } = jwt;

export const AuthToken = (payload, expires) => {
    const expiresIn = expires || 1
    let token = jwt.sign(payload, SECRET_JWT, {
        expiresIn: 3600*24*expiresIn
    });
    return `Bearer ${token}`;
};

export const VerifyToken = async (token) => {
    let decodedToken;
    try {
        decodedToken = await verify(token, SECRET_JWT);
    } catch (err) {
        return null
    }

    return decodedToken;
};

export const RefreshToken = (payload, number: number) => {
    let useragent = `${payload.useragent.browser}: ${payload.useragent.version}, ${payload.useragent.platform}: ${payload.useragent.os}, ${payload.useragent.source}`

    return sign({...payload, useragent}, SECRET_JWT, {
        expiresIn: 3600*24*(number && number > 0 ? number : 1)
    });
}