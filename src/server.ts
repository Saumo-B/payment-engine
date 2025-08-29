import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import { makeToken } from "./lib/token.ts";
// import { connectDB } from "./db.ts";
import orders from "./routes/order.ts";
// import admin from "./routes/admin.js";
// import webhooks from "./routes/webhooks.js";

const app = express();

// app.listen(process.env.PORT, () => {
//     console.log("Server listening on", process.env.PORT);
// })
app.get('/',(req,res)=> {
  res.send('Payment engine is Running')
})
app.get("/token", (req, res) =>{
  try {
    const token = makeToken();
    res.json({token});
  } catch (e) { next(e);}
})
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN?.split(",") || true }));
app.use(express.json()); // for normal routes (webhook route handles raw body itself)

app.use("/api/orders", orders);
// // app.use("/api/admin", admin);
// // app.use("/api/webhooks", webhooks);

// app.use((err:any, _req:any, res:any, _next:any) => {
//   console.error(err);
//   res.status(500).json({ error: "server_error" });
// });
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database!");
    app.listen(process.env.PORT  , () => {
    console.log("Server listening on", process.env.PORT );
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });

