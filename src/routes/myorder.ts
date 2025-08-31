import { Router } from "express";
import { Order } from "../models/Order.ts";

const router = Router();

// GET /api/myorders?phone=+911234567890
router.get("/", async (req, res, next) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const orders = await Order.find({ phone })
      .sort({ createdAt: -1 }) // requires timestamps in schema
      .limit(5);

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this phone number" });
    }

    res.json({ orders });
  } catch (err) {
    next(err);
  }
});
// router.get("/", (req, res) => {
//   res.json({ message: "myorders route is alive!", phone: req.query.phone });
// });
export default router;
