import {Router} from 'express';

import { delivery, allDelivery, createDelivery, updateDelivery, deleteDelivery, allDeliveryByStatus, communes, allWilayas, deliveryFees, deliveryBySearch, deliveryExport, resendOrderInYalidine } from '../controllers/index.js';
import { AuthMiddleware } from '../middlewares/Auth.js';
export const router = Router();

router.get("/orders/:id", AuthMiddleware, async (req, res, next) => await delivery(req, res))
router.get("/orders/", AuthMiddleware, async (req, res, next) => await allDelivery(req, res));
router.get("/ordersByStatus/:status", AuthMiddleware, async (req, res, next) => await allDeliveryByStatus(req, res));
router.get("/ordersBySearch/:status/:search", AuthMiddleware, async (req, res, next) => await deliveryBySearch(req, res));
router.get("/deliveryExport/:status/:type", AuthMiddleware, async (req, res, next) => await deliveryExport(req, res));

router.post("/orders", async (req, res, next) => await createDelivery(req, res))
router.put("/orders/:id", AuthMiddleware, async (req, res, next) => await updateDelivery(req, res))
router.delete("/orders/:id", AuthMiddleware, async (req, res, next) => await deleteDelivery(req, res))

router.put("/resend-orders/:id", AuthMiddleware, async (req, res, next) => await resendOrderInYalidine(req, res))

router.get("/communes/:id", async (req, res, next) => await communes(req, res))
router.get("/wilayas/", async (req, res, next) => await allWilayas(req, res));
router.get("/deliveryfees/:wilaya_id", async (req, res, next) => await deliveryFees(req, res));