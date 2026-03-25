import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { checkoutSuccess, createCheckoutSession } from '../controllers/payment.controller.js';

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", protectRoute, createCheckoutSession);
paymentRouter.post("/checkout-success", protectRoute, checkoutSuccess);

export default paymentRouter;