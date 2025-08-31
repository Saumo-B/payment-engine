import { Router } from "express";
import "dotenv/config";
import { Order } from "../models/Order.ts";

const router = Router();

router.get("/phone=:phone", async (req, res, next) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // Fetch last 5 orders for the given phone, sorted by creation time (latest first)
    const orders = await Order.find({ phone })
      .sort({ createdAt: -1 }) // requires timestamps in schema
      .limit(5);

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this phone number" });
    }
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

export default router;
