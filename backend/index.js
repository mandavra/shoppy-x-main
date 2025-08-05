import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import connectDB from "./config/database.js"
import productsRouter from "./routers/productsRouter.js"
import categoryRouter from "./routers/categoryRouter.js"
import userRouter from "./routers/userRouter.js"
import cartRouter from "./routers/cartRouter.js"
import adminRouter from "./routers/adminRouter.js"
import bannerRouter from "./routers/bannerRouter.js"
import offerRouter from "./routers/offerRouter.js"
import orderRouter from "./routers/orderRouter.js"
import paymentRouter from "./routers/paymentRouter.js"
import couponRouter from "./routers/couponRouter.js"
import contactRouter from "./routers/contactRouter.js"
import mailRouter from "./routers/mailRouter.js"
import reviewRouter from "./routers/reviewRouter.js"
import currencyRateRouter from "./routers/currencyRateRouter.js"
import emiRouter from "./routers/emiRouter.js"
import cookieParser from "cookie-parser"
import userModel from "./models/userModel.js";
import bcrypt from "bcrypt";

dotenv.config()

const app = express()

// ✅ CORS FIX
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}))

// ✅ Core Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))

// ✅ Connect DB and create default admin
connectDB().then(async () => {
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";

  const existingAdmin = await userModel.findOne({ email: adminEmail, role: "admin" });
  if (!existingAdmin) {
    await userModel.create({
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      contactNo: 9999999999,
      address: {
        area: "",
        city: "",
        state: "",
        country: "",
        postalCode: 0
      }
    });
    console.log("✅ Default admin user created:");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
  } else {
    console.log("✅ Admin user already exists.");
  }
});

// ✅ Mount Routes
app.use("/api/v1/products", productsRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/banners", bannerRouter)
app.use("/api/v1/offers", offerRouter)
app.use("/api/v1/coupons", couponRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/contact", contactRouter)
app.use("/api/v1/mail", mailRouter)
app.use("/api/v1/payments", paymentRouter)
app.use("/api/v1/currencyRate", currencyRateRouter)
app.use("/api/v1/emi", emiRouter)

// ❌ 404 Handler
app.use("*", (req, res, next) => {
    res.status(404).json({
        status: "error",
        message: "This page is not found"
    })
})

// 🔥 Global Error Handler
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).json({
        status: "error",
        message: err.message || "Something went wrong",
        details: err
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})
