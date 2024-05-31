import {Router} from 'express';

import { deliveryCompany, allDeliveryCompany, createDeliveryCompany, updateDeliveryCompany, deleteDeliveryCompany, hasDeliveryCompany } from '../controllers/index.js';
import { AuthMiddleware } from '../middlewares/Auth.js';
export const router = Router();

router.get("/delivery-company/:id", AuthMiddleware, async (req, res, next) => await deliveryCompany(req, res))
router.get("/delivery-company/", AuthMiddleware, async (req, res, next) => await allDeliveryCompany(req, res));
router.get("/has-delivery-company/", async (req, res, next) => await hasDeliveryCompany(req, res));

router.post("/delivery-company", AuthMiddleware, async (req, res, next) => await createDeliveryCompany(req, res))
router.put("/delivery-company/:id", AuthMiddleware, async (req, res, next) => await updateDeliveryCompany(req, res))
router.delete("/delivery-company/:id", AuthMiddleware, async (req, res, next) => await deleteDeliveryCompany(req, res))