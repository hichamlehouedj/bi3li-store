import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import dotenv from 'dotenv'
dotenv.config();

const SECRET = process.env.SECRET_JWT

export const AuthMiddlewareSocket = async (auth) => {
    const authSocket = auth;

    if (!authSocket) {
        return null;
    }

    const token = authSocket.split(" ")[1];

    if (!token || token === "") {
        return null;
    }

    // Verify the extracted token
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, SECRET);
    } catch (err) {
        return null;
    }

    // If decoded token is null then set authentication of the request false
    if (!decodedToken) {
        return null;
    }

    // If the user has valid token then Find the user by decoded token's id
    let authUser = await User.findById(decodedToken.id);
    if (!authUser) {
        return null;
    }

    return authUser;
}