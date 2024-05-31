import {Router} from 'express';
import { logger } from '../config/logger.js';
import { User } from '../models/index.js';

import { user, allUser, createUser, updateUser, deleteUser, logIn, forgetPassword, changePassword, verifyCode, updatePassword, authorizationSheets, saveAuthorizationSheets, addSpreadsheetId } from '../controllers/index.js';

import { AuthMiddleware } from '../middlewares/Auth.js';
export const router = Router();

router.post("/users/sign-up", async (req, res, next) => await createUser(req, res))
router.post("/users/log-in", async (req, res, next) => await logIn(req, res))

router.post("/users/forget-password", async (req, res, next) => await forgetPassword(req, res))
router.post("/users/verify-code", async (req, res, next) => await verifyCode(req, res))
router.post("/users/change-password", async (req, res, next) => await changePassword(req, res))

router.put("/users/update-password/:id", async (req, res, next) => await updatePassword(req, res))

router.get("/users/:id", AuthMiddleware, async (req, res, next) => await user(req, res))
router.get("/users", AuthMiddleware, async (req, res, next) => await allUser(req, res));

router.put("/users/:id", AuthMiddleware, async (req, res, next) => await updateUser(req, res))
router.delete("/users/:id", AuthMiddleware, async (req, res, next) => await deleteUser(req, res))

router.get("/authorization-sheets", async (req, res, next) => await authorizationSheets(req, res))
router.post("/authorization-sheets", async (req, res, next) => await saveAuthorizationSheets(req, res))
router.post("/add-spreadsheet-id", async (req, res, next) => await addSpreadsheetId(req, res))