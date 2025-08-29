import { Router } from "express";
import "dotenv/config";
import { Order } from "../models/Order.ts";
import { makeToken } from "../lib/token.ts";
import { randomUUID, UUID } from "crypto";
// import crypto from "crypto";
// import axios from "axios";
import { StandardCheckoutClient, Env, StandardCheckoutPayRequest} from "pg-sdk-node";

const router = Router();

const client= StandardCheckoutClient.getInstance(process.env.MERCHANT_ID,process.env.SALT_KEY, parseInt(process.env.SALT_INDEX), Env.SANDBOX)
    
// Create order
router.post("/", async (req, res, next) => {
  try {
    const { items = [], customer } = req.body || {};
    const amount = items.reduce((sum: number, it: any) => sum + it.price * it.qty, 0);
    const orderToken = randomUUID()
    const token = makeToken();

    // 1) Create PhonePe order payload
    // const transactionId= orderToken;
    //   // merchantUserId: customer.phone,
    //   amount: amount * 100, // paise
    const  redirectUrl= `${process.env.BACKEND_ORIGIN}/api/orders/status?id=${orderToken}`;
    const request = StandardCheckoutPayRequest.builder()
    .merchantOrderId(orderToken)
    .amount(amount*100)
    .redirectUrl(redirectUrl)
    .build()
    //   redirectMode: "POST",
    //   callbackUrl: `${process.env.BACKEND_ORIGIN}/phonepe/callback`,
    //   mobileNumber: customer.phone,
    //   paymentInstrument: {
    //     type: "PAY_PAGE",
    //   },
    // };

    // 2) Encode & checksum
    // const payload = JSON.stringify(data);
    // const payloadMain = Buffer.from(payload).toString("base64");
    // const string = payloadMain + "/checkout/v2/pay" + process.env.SALT_KEY;
    // const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    // const checksum = sha256 + "###" + process.env.SALT_INDEX;

    // 3) Call PhonePe
    const response = await client.pay(request)
    // return res.json({
    //   checkoutPageUrl:response.redirectUrl
    // })
    //   method: "POST",
    //   url: process.env.PHONEPE_GATEWAY_URL, // should be https://api-preprod.phonepe.com/apis/checkout/v2/pay
    //   headers: {
    //     accept: "application/json",
    //     "Content-Type": "application/json",
    //     "X-VERIFY": checksum,
    //     "X-MERCHANT-ID": process.env.MERCHANT_ID,
    //     "Authorization": `Bearer ${process.env.MERCHANT_ID}`,
    //   },
    //   data: { request: payloadMain },
    // });

    // 4) Save local order
    const order = await Order.create({
      status: "created",
      amount,
      currency: "INR",
      lineItems: items,
      customer,
      orderToken,
    });

    // 5) Respond once
    return res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      token: order.orderToken,
      checkoutPageUrl:response.redirectUrl // include PhonePe response
    });
  } catch (e: any) {
    console.error("PhonePe error:", e.response?.data || e.message);
    return res.status(400).json({ error: e.response?.data || e.message });
  }
});

// Get order status
router.get("/status", async (req, res, next) => {
  try {
    const { id: orderToken } = req.query;
    if (!orderToken) {
      return res.status(400).send("Order Id missing");
    }

    // 🔹 Get order status from PhonePe
    const response = await client.getOrderStatus(orderToken as string);
    const status = response.state; // COMPLETED, FAILED, etc.

    // 🔹 Update order in DB
    await Order.findOneAndUpdate(
      { orderToken },
      { status: status.toLowerCase() }, // store lowercase for consistency
      { new: true }
    );

    // 🔹 Redirect user based on status
    if (status === "COMPLETED") {
      return res.redirect(`${process.env.FRONTEND_ORIGIN}/order/${orderToken}`);
    } else {
      return res.redirect(`${process.env.FRONTEND_ORIGIN}/failure`);
    }
  } catch (e) {
    console.error("Status check error:", e);
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(order);
  } catch (e) {
    next(e);
  }
});


export default router;
