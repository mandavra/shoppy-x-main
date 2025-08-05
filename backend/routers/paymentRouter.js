import express from "express"
import * as paymentController from "../controllers/paymentController.js"
import * as userController from "../controllers/userController.js"
const router = express.Router()

// Basic payment routes
router.post("/create-payment-session", userController.protectRoute, paymentController.createPaymentSession)
router.post("/process-payment", userController.protectRoute, paymentController.processPayment)
router.get("/payment-status", userController.protectRoute, paymentController.getPaymentStatus)

// Payment method and configuration routes
router.get("/payment-methods", paymentController.getPaymentMethods)
router.get("/banks", paymentController.getBanks)
router.post("/generate-upi-qr", userController.protectRoute, paymentController.generateUPIQR)
router.post("/validate-upi", paymentController.validateUPI)

// Payment management routes
router.get("/payment-history", userController.protectRoute, paymentController.getUserPaymentHistory)
router.get("/analytics", userController.protectRoute, paymentController.getPaymentAnalytics)
router.put("/cancel/:paymentId", userController.protectRoute, paymentController.cancelPayment)
router.post("/refund/:paymentId", userController.protectRoute, paymentController.refundPayment)

export default router