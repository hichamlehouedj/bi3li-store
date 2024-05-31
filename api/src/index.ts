import express, {Request} from 'express';
import http from 'http';
import cors from 'cors';
import 'dotenv/config'

import path from "path";
import {fileURLToPath} from "url";
// @ts-ignore
import cookieParser from "cookie-parser";
import { express as expressUserAgent } from 'express-useragent';
import { AuthMiddleware } from "./middlewares/index.js"
import mongoose from "mongoose";
import fileUpload from 'express-fileupload';
import {socketServer} from "./socket/server.js";

import {ProductRouter, DeliveryRouter, UserRouter, StoreRouter, DeliveryCompanyRouter, LandingProductRouter, CategoryRouter, CartAbandonedRouter}  from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

interface Req extends Request {
    user: any;
    isAuth: boolean;
}

let socket = null;

(async function () {
    let whitelist = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3005",
        "https://golden-cage.bi3li.shop",
        "https://golden-cage-admin.bi3li.shop"
    ]

    let corsOptionsDelegate = function (req, callback) {
        let corsOptions;

        // console.log('Origin', req.header('Origin'))

        if (whitelist.indexOf(req.header('Origin')) !== -1) {
            corsOptions = {origin: req.header('Origin'), credentials: true}
        } else {
            corsOptions = { origin: false, credentials: false }
        }

        callback(null, corsOptions)
    }

    const app = express();
    const httpServer = http.createServer(app);

    app.use('/images', express.static(path.join(__dirname, '../uploads')))

    app.use(cors(corsOptionsDelegate));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    // @ts-ignore
    app.use(fileUpload({limits: { fileSize: 50 * 1024 * 1024 }}));
    app.use(cookieParser());
    app.use(expressUserAgent());
    // app.use(AuthMiddleware);
    
    app.use('/api', ProductRouter);
    app.use('/api', DeliveryRouter);
    app.use('/api', UserRouter);
    app.use('/api', StoreRouter);
    app.use('/api', DeliveryCompanyRouter);
    app.use('/api', LandingProductRouter);
    app.use('/api', CategoryRouter);
    app.use('/api', CartAbandonedRouter);

    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log('MongoDB Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    try {
        socket = new socketServer(httpServer)
        await socket.connection()
    }  catch (error) {
        console.error('socket server error:', error);
    }

    const Port = process.env.PORT
    httpServer.listen({ port: Port }, () => {
        console.log(`🚀 Server ready at http://localhost:${Port}`);
    })
})()

export { socket }