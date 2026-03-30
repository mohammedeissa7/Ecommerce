import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/DB.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import paymentRouter from './routes/payment.route.js';
import analyticsRouter from './routes/analytics.route.js';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/analytics', analyticsRouter);


app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port http://localhost:${PORT}`);
});