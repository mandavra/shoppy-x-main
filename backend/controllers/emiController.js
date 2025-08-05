import EMI from "../models/emiModel.js";
import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";
import { getEMIOptions, formatEMIOption } from "../utils/emiCalculator.js";

// Get EMI options for a given amount
export async function getEMIOptionsController(req, res, next) {
    try {
        const { amount } = req.params;
        const principalAmount = parseFloat(amount);
        
        if (!principalAmount || principalAmount <= 0) {
            return res.status(400).json({
                status: "error",
                message: "Invalid amount provided"
            });
        }

        const emiOptions = getEMIOptions(principalAmount);
        const formattedOptions = emiOptions.map(formatEMIOption);

        res.status(200).json({
            status: "success",
            data: formattedOptions
        });
    } catch (error) {
        next(error);
    }
}

// Create EMI payment
export async function createEMIPayment(req, res, next) {
    try {
        const { orderId, tenure, principalAmount } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!orderId || !tenure || !principalAmount) {
            return res.status(400).json({
                status: "error",
                message: "Order ID, tenure, and principal amount are required"
            });
        }

        // Check if order exists
        const order = await Order.findOne({ orderId, user: userId });
        if (!order) {
            return res.status(404).json({
                status: "error",
                message: "Order not found"
            });
        }

        // Check if EMI already exists for this order
        const existingEMI = await EMI.findOne({ order: order._id });
        if (existingEMI) {
            return res.status(400).json({
                status: "error",
                message: "EMI already exists for this order"
            });
        }

        // Calculate EMI details
        const emiOptions = getEMIOptions(principalAmount);
        const selectedEMI = emiOptions.find(option => option.tenure === parseInt(tenure));
        
        if (!selectedEMI) {
            return res.status(400).json({
                status: "error",
                message: "Invalid tenure selected"
            });
        }

        // Create payment record
        const payment = await Payment.create({
            user: userId,
            order: order._id,
            amount: principalAmount,
            paymentMethod: "EMI",
            paymentStatus: "completed",
            paymentDetails: {
                emiTenure: tenure,
                monthlyEMI: selectedEMI.monthlyEMI,
                totalInterest: selectedEMI.totalInterest,
                totalAmount: selectedEMI.totalAmount,
                interestRate: selectedEMI.interestRate
            }
        });

        // Create EMI record
        const emi = await EMI.create({
            order: order._id,
            user: userId,
            payment: payment._id,
            principalAmount,
            tenure: parseInt(tenure),
            interestRate: selectedEMI.interestRate,
            monthlyEMI: selectedEMI.monthlyEMI,
            totalInterest: selectedEMI.totalInterest,
            totalAmount: selectedEMI.totalAmount
        });

        // Update order status
        order.orderStatus = "confirmed";
        order.orderStatusTimeline.push({
            title: "Order Confirmed",
            status: true,
            description: `Order confirmed with EMI payment. EMI ID: ${emi.emiId}`,
            date: new Date()
        });
        await order.save();

        res.status(201).json({
            status: "success",
            data: {
                emi,
                payment,
                message: "EMI payment created successfully"
            }
        });
    } catch (error) {
        next(error);
    }
}

// Get user's EMI details
export async function getUserEMIs(req, res, next) {
    try {
        const userId = req.user.id;
        
        const emis = await EMI.find({ user: userId })
            .populate('order', 'orderId totalPrice finalPrice')
            .populate('payment', 'paymentId amount paymentStatus')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            data: emis
        });
    } catch (error) {
        next(error);
    }
}

// Get specific EMI details
export async function getEMIDetails(req, res, next) {
    try {
        const { emiId } = req.params;
        const userId = req.user.id;

        const emi = await EMI.findOne({ emiId, user: userId })
            .populate('order', 'orderId totalPrice finalPrice products')
            .populate('payment', 'paymentId amount paymentStatus');

        if (!emi) {
            return res.status(404).json({
                status: "error",
                message: "EMI not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: emi
        });
    } catch (error) {
        next(error);
    }
}

// Update EMI payment status (for admin use)
export async function updateEMIPaymentStatus(req, res, next) {
    try {
        const { emiId } = req.params;
        const { paymentNumber, status } = req.body;

        const emi = await EMI.findOne({ emiId });
        if (!emi) {
            return res.status(404).json({
                status: "error",
                message: "EMI not found"
            });
        }

        // Find and update the specific payment
        const payment = emi.paymentHistory.find(p => p.paymentNumber === paymentNumber);
        if (!payment) {
            return res.status(404).json({
                status: "error",
                message: "Payment not found"
            });
        }

        payment.status = status;
        if (status === "paid") {
            payment.paidDate = new Date();
            emi.remainingPayments -= 1;
            
            if (emi.remainingPayments === 0) {
                emi.emiStatus = "completed";
            } else {
                // Update next payment date
                const nextPayment = emi.paymentHistory.find(p => p.status === "pending");
                if (nextPayment) {
                    emi.nextPaymentDate = nextPayment.dueDate;
                }
            }
        }

        await emi.save();

        res.status(200).json({
            status: "success",
            data: emi,
            message: "EMI payment status updated successfully"
        });
    } catch (error) {
        next(error);
    }
} 