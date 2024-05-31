import jwt from 'jsonwebtoken';
// import { User } from '../models/index.js';
import {User} from '../models/index.js';
import dotenv from 'dotenv'
import {serializeUser} from "../helpers/index.js";
dotenv.config();

const SECRET = process.env.SECRET_JWT

export const AuthMiddleware = async (req, res, next) => {
    // Extract Authorization Header
    const authHeader = req.get("Authorization");
    
    if (!authHeader) {
        res.status(401).send();
        return ;
    }
    
    // Extract the token and check for token
    const token = authHeader.split(" ")[1];

    if (!token || token === "") {
        res.status(401).send();
        return ;
    }

    // Verify the extracted token
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, SECRET);
    } catch (err) {
        res.status(401).send();
        return ;
    }

    // If decoded token is null then set authentication of the request false
    if (!decodedToken) {
        res.status(401).send();
        return ;
    }

    // If the user has valid token then Find the user by decoded token's id
    let authUser = await User.findById(decodedToken.id);
    if (!authUser) {
        res.status(401).send();
        return ;
    }

    return next();
}