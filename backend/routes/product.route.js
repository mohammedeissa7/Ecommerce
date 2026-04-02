import express from 'express';      
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getRecommendedProducts, getProductByCategory, getProductById } from '../controllers/product.controller.js';


const productRouter = express.Router();


productRouter.get('/', getAllProducts);
productRouter.get('/featured', getFeaturedProducts);
productRouter.get('/recommended', getRecommendedProducts);
productRouter.get('/category/:category', getProductByCategory);
productRouter.get('/:id', getProductById);
productRouter.post('/', protectRoute, adminRoute, createProduct);
productRouter.delete('/:id', protectRoute, adminRoute, deleteProduct);

export default productRouter;