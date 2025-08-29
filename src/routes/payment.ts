import { Router } from "express";
// import Razorpay from "razorpay";

const router = Router();

// // init razorpay client
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!
// });

// // Create Razorpay order (required for UPI payment)
// router.post("/create", async (req, res) => {
//   try {
//     const { amount } = req.body; // in paise
//     const order = await razorpay.orders.create({
//       amount, // e.g., 5000 paise = ₹50
//       currency: "INR",
//       payment_capture: 1
//     });

//     res.json({
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       key: process.env.RAZORPAY_KEY_ID
//     });
//   } catch (err: any) {
//     console.error(err);
//     res.status(500).json({ error: "Razorpay order creation failed" });
//   }
// });

// // Verify Razorpay signature (after frontend payment success)
// import crypto from "crypto";

// router.post("/verify", (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//   const sign = razorpay_order_id + "|" + razorpay_payment_id;
//   const expectedSign = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
//     .update(sign.toString())
//     .digest("hex");

//   if (razorpay_signature === expectedSign) {
//     res.json({ status: "success", paymentId: razorpay_payment_id });
//   } else {
//     res.status(400).json({ status: "failed", message: "Signature mismatch" });
//   }
// });

// export default router;

