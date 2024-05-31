import bcrypt from 'bcryptjs';
import { logger } from "../config/logger.js";

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        logger.error(error)
    }
}

export const comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        logger.error(error)
    }
}