import {Router} from 'express';

import { createCartAbandoned } from '../controllers/index.js';
import { AuthMiddleware } from '../middlewares/Auth.js';
export const router = Router();

router.post("/cart-abandoned", async (req, res, next) => await createCartAbandoned(req, res))
