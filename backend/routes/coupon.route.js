import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getCoupon, validateCoupon } from '../controllers/coupon.controller.js';
const couponRouter = express.Router();

couponRouter.get("/", protectRoute, getCoupon);
couponRouter.post("/validate", protectRoute, validateCoupon);

export default couponRouter;