import express from 'express';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import connectDB from './config/DB';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});