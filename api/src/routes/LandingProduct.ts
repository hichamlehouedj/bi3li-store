import {Router} from 'express';

import { landingProduct, allLandingProduct, createLandingProduct, updateLandingProduct, deleteLandingProduct } from '../controllers/index.js';
import { AuthMiddleware } from '../middlewares/Auth.js';
export const router = Router();

router.get("/landing-product/:link", async (req, res, next) => await landingProduct(req, res))
router.get("/landing-product", async (req, res, next) => await allLandingProduct(req, res));

router.post("/landing-product", AuthMiddleware, async (req, res, next) => await createLandingProduct(req, res))
router.put("/landing-product/:id", AuthMiddleware, async (req, res, next) => await updateLandingProduct(req, res))
router.delete("/landing-product/:id", AuthMiddleware, async (req, res, next) => await deleteLandingProduct(req, res))