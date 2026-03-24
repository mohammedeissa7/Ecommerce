import express from 'express';      
import { adminRoute, protectRoute } from '../middleware/auth.middleware';
import { getAllProducts } from '../controllers/product.controller';


const productRouter = express.Router();


productRouter.get('/', protectRoute,adminRoute, getAllProducts);

export default productRouter;