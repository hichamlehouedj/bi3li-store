import {Router} from 'express';
import { logger } from '../config/logger.js';
import { Product } from '../models/index.js';

import { product, allProduct, createProduct, updateProduct, deleteProduct, deleteImageFromProduct, allPostingProduct, allUpSellProduct } from '../controllers/index.js';
import { AuthMiddleware } from '../middlewares/Auth.js';
export const router = Router();

router.get("/products/:id", async (req, res, next) => await product(req, res))
router.get("/products", async (req, res, next) => await allProduct(req, res));
router.get("/posting-products", async (req, res, next) => await allPostingProduct(req, res));
router.get("/upsell-products", async (req, res, next) => await allUpSellProduct(req, res));

router.post("/products", AuthMiddleware, async (req, res, next) => await createProduct(req, res))
router.put("/products/:id", AuthMiddleware, async (req, res, next) => await updateProduct(req, res))
router.delete("/products/:id", AuthMiddleware, async (req, res, next) => await deleteProduct(req, res))


router.post("/products/delete-image", AuthMiddleware, async (req, res, next) => await deleteImageFromProduct(req, res))