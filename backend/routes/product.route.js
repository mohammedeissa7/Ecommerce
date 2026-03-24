import express from 'express';      
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { createProduct, getAllProducts, getFeaturedProducts } from '../controllers/product.controller.js';


const productRouter = express.Router();


productRouter.get('/', protectRoute,adminRoute, getAllProducts);
productRouter.get('/featured', getFeaturedProducts);
productRouter.post('/', protectRoute, adminRoute, createProduct);

export default productRouter;