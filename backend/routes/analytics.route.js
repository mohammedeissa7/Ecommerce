import express from "express";
import { getAnalyticsDiagramData } from "../controllers/analytics.controller.js";
import { adminRoute, protectRoute } from './../middleware/auth.middleware.js';

const analyticsRouter = express.Router();

analyticsRouter.get("/", protectRoute, adminRoute, getAnalyticsDiagramData);

export default analyticsRouter;