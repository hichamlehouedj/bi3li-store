import {Router} from 'express';

import { category, allCategory, createCategory, updateCategory, deleteCategory } from '../controllers/index.js';
import { AuthMiddleware } from '../middlewares/Auth.js';
export const router = Router();

router.get("/category/:id", async (req, res, next) => await category(req, res))
router.get("/category", async (req, res, next) => await allCategory(req, res));

router.post("/category", AuthMiddleware, async (req, res, next) => await createCategory(req, res))
router.put("/category/:id", AuthMiddleware, async (req, res, next) => await updateCategory(req, res))
router.delete("/category/:id", AuthMiddleware, async (req, res, next) => await deleteCategory(req, res))