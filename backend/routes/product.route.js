import express from 'express';      
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getRecommendedProducts, getProductByCategory, toggleFeaturedProduct } from '../controllers/product.controller.js';


const productRouter = express.Router();


productRouter.get('/', protectRoute,adminRoute, getAllProducts);
productRouter.get('/featured', getFeaturedProducts);
productRouter.get('/recommended', getRecommendedProducts);
productRouter.get('/category/:category', getProductByCategory);
productRouter.get('/:id', protectRoute, adminRoute, toggleFeaturedProduct);
productRouter.post('/', protectRoute, adminRoute, createProduct);
productRouter.delete('/:id', protectRoute, adminRoute, deleteProduct);

export default productRouter;