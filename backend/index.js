import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/DB.js';
import authRouter from './routes/auth.route.js';


dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port http://localhost:${PORT}`);
});