import { Router } from "express";
import "dotenv/config";
import { Order } from "../models/Order.ts";
// import mongoose from "mongoose";

const router = Router();

// Get all orders for today
router.get("/today", async (req, res, next) => {
  try {
    // Get start of today (midnight)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Get end of today (23:59:59)
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Query orders created today
    const orders = await Order.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    })
      .sort({ createdAt: -1 }) // latest first
      .lean();

    return res.json({
      count: orders.length,
      orders,
    });
  } catch (e) {
    console.error("Fetch today's orders error:", e);
    next(e);
  }
});

export default router;


