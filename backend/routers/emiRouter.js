import express from "express";
import * as emiController from "../controllers/emiController.js";
import { checkAuth } from "../controllers/userController.js";

const router = express.Router();

// Get EMI options for a given amount (public route)
router.get("/options/:amount", emiController.getEMIOptionsController);

// Protected routes (require authentication)
router.use(checkAuth);

// Create EMI payment
router.post("/create", emiController.createEMIPayment);

// Get user's EMI details
router.get("/user", emiController.getUserEMIs);

// Get specific EMI details
router.get("/:emiId", emiController.getEMIDetails);

// Update EMI payment status (admin only)
router.patch("/:emiId/payment-status", emiController.updateEMIPaymentStatus);

export default router; 