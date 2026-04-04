import express from "express";
import mongoose from "mongoose";
import { redis } from "../config/redis.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const checks = {
        status  : "ok",
        uptime  : `${Math.floor(process.uptime())}s`,
        mongo   : "unknown",
        redis   : "unknown",
    };

    // MongoDB check
    try {
        checks.mongo = mongoose.connection.readyState === 1 ? "ok" : "degraded";
    } catch {
        checks.mongo = "error";
    }

    // Redis check
    try {
        await redis.ping();
        checks.redis = "ok";
    } catch {
        checks.redis = "error";
    }

    const allOk = checks.mongo === "ok" && checks.redis === "ok";
    res.status(allOk ? 200 : 503).json(checks);
});

export default router;