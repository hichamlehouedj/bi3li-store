import {Router} from 'express';

import { allPixels, allStatistics, pixel, createPixel, updatePixel, deletePixel, allDeliveryPrices, createDeliveryPrice, addHeader, addTopBar, getStore, updateStore } from '../controllers/index.js';
import { AuthMiddleware } from '../middlewares/Auth.js';

export const router = Router();

router.get("/store", async (req, res, next) => await getStore(req, res));
router.get("/store/statistics", AuthMiddleware, async (req, res, next) => await allStatistics(req, res));
router.post("/store/topBar", AuthMiddleware, async (req, res, next) => await addTopBar(req, res));
router.post("/store/header", AuthMiddleware, async (req, res, next) => await addHeader(req, res));
router.put("/store", AuthMiddleware, async (req, res, next) => await updateStore(req, res))

router.get("/pixels/:id", async (req, res, next) => await pixel(req, res))
router.get("/pixels", async (req, res, next) => await allPixels(req, res));


router.post("/pixels", AuthMiddleware, async (req, res, next) => await createPixel(req, res))
router.put("/pixels/:id", AuthMiddleware, async (req, res, next) => await updatePixel(req, res))
router.delete("/pixels/:id", AuthMiddleware, async (req, res, next) => await deletePixel(req, res))

router.get("/delivery-price", async (req, res, next) => await allDeliveryPrices(req, res));
router.post("/delivery-price", async (req, res, next) => await createDeliveryPrice(req, res))