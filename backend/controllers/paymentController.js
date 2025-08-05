import dotenv from "dotenv"
import Order from "../models/orderModel.js"
import User from "../models/userModel.js"
import Payment from "../models/paymentModel.js"
import CurrencyRate from "../models/currencyRateModel.js"

dotenv.config()

// Payment method validation
const validatePaymentMethod = (method, details) => {
    switch (method) {
        case "card":
            return details.cardNumber && details.expiryDate && details.cvv && details.cardHolderName;
        case "upi":
            return details.upiId && details.upiId.includes("@");
        case "netbanking":
            return details.bankName;
        case "emi":
            return details.bankName && details.cardNumber;
        default:
            return false;
    }
};

// Generate UPI QR code data
const generateUPIQRData = (amount, upiId, merchantName = "ShoppyX") => {
    const qrData = {
        upi: upiId,
        amount: amount,
        merchant: merchantName,
        currency: "INR",
        timestamp: new Date().toISOString()
    };
    return JSON.stringify(qrData);
};

export async function createPaymentSession(req, res, next) {
    try {
      const user = req.user
        const { products, totalPrice, finalPrice, paymentMethod = "card" } = req.body
  
      if (!products?.length || !finalPrice)
        return res.status(400).json({ message: "Missing fields" })
  
       // calling my api as the usd and inr amount changes
       const currencyRate = await CurrencyRate.findOne().select("inrRate")
       if (!currencyRate?.inrRate) {
        // If no currency rate found, use default rate of 1 (assuming INR is base currency)
        console.log("Currency rate not found, using default rate");
      }

        // Create order first
      const order = await Order.create({
        user: user._id,
            products,
        totalPrice,
        finalPrice,
            orderStatus: "Payment Pending",
        orderStatusTimeline: [
          {
            title: "Order Placed",
            status: true,
            description: "Order confirmed",
            date: new Date(),
          },
          {
            title: "Shipped",
            status: false,
            description: "Package has been shipped",
          },
          {
            title: "In Transit",
            status: false,
            description: "Package arrived at local facility",
          },
          {
            title: "Out for Delivery",
            status: false,
            description: "Package is out for delivery",
          },
          {
            title: "Delivered",
            status: false,
            description: "Package delivered to recipient",
          },
        ],
      })
  
        // Create payment record
        const payment = await Payment.create({
            user: user._id,
            order: order._id,
            amount: finalPrice,
            currency: "INR",
            paymentMethod,
            paymentStatus: "pending",
            transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            paymentDetails: {
                products,
                totalPrice,
                finalPrice,
                currencyRate: currencyRate?.inrRate || 1,
                createdAt: new Date(),
                sessionId: `SESS_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                paymentMethod: paymentMethod
            }
        })

        // Update user cart
      user.orders.push(order._id)
      user.cart = []
      user.cartAmount = 0
      await user.save()
  
        res.status(200).json({ 
            message: "Payment session created successfully",
            paymentId: payment.paymentId,
            orderId: order.orderId,
            amount: finalPrice,
            currency: "INR",
            sessionId: payment.paymentDetails.sessionId
        })
    } catch (err) {
        next(err)
    }
}

export async function processPayment(req, res, next) {
    try {
        const { paymentId, transactionDetails } = req.body
        if (!paymentId) return res.status(400).json({ message: "Payment ID missing" })

        const payment = await Payment.findOne({ paymentId }).populate('order')
        if (!payment) return res.status(404).json({ message: "Payment not found" })

        if (payment.paymentStatus === "completed") {
            return res.status(400).json({ message: "Payment already completed" })
        }

        // Validate payment method details
        if (!validatePaymentMethod(payment.paymentMethod, transactionDetails)) {
            return res.status(400).json({ message: "Invalid payment details" })
        }

        // Simulate payment processing based on payment method
        let isPaymentSuccessful = false;
        let processingTime = 0;

        switch (payment.paymentMethod) {
            case "card":
                isPaymentSuccessful = Math.random() > 0.15; // 85% success rate
                processingTime = 2000 + Math.random() * 3000; // 2-5 seconds
                break;
            case "upi":
                isPaymentSuccessful = Math.random() > 0.05; // 95% success rate
                processingTime = 1000 + Math.random() * 2000; // 1-3 seconds
                break;
            case "netbanking":
                isPaymentSuccessful = Math.random() > 0.10; // 90% success rate
                processingTime = 3000 + Math.random() * 4000; // 3-7 seconds
                break;
            case "emi":
                isPaymentSuccessful = Math.random() > 0.20; // 80% success rate
                processingTime = 5000 + Math.random() * 5000; // 5-10 seconds
                break;
            default:
                isPaymentSuccessful = Math.random() > 0.1; // 90% success rate
                processingTime = 2000;
        }

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, processingTime));

        if (isPaymentSuccessful) {
            // Update payment status
            payment.paymentStatus = "completed"
            payment.paymentDetails = {
                ...payment.paymentDetails,
                transactionDetails,
                processedAt: new Date(),
                processingTime: processingTime,
                gatewayResponse: {
                    status: "success",
                    transactionId: `GATEWAY_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
                    responseCode: "00",
                    responseMessage: "Transaction successful",
                    paymentMethod: payment.paymentMethod
                }
            }
            await payment.save()

            // Update order status
            const order = payment.order
            order.orderStatus = "Order Placed"
            order.paymentIntentId = payment.transactionId
            await order.save()

            res.status(200).json({ 
                message: "Payment processed successfully",
                paymentStatus: "completed",
                orderId: order.orderId,
                transactionId: payment.transactionId,
                processedAt: payment.paymentDetails.processedAt,
                processingTime: processingTime
            })
        } else {
            // Payment failed
            const failureReasons = {
                card: ["Insufficient funds", "Card expired", "Invalid CVV", "Transaction declined"],
                upi: ["UPI ID not found", "Transaction timeout", "Insufficient balance"],
                netbanking: ["Login failed", "Transaction timeout", "Insufficient funds"],
                emi: ["EMI not available", "Card not eligible", "Insufficient credit limit"]
            };

            const reason = failureReasons[payment.paymentMethod]?.[Math.floor(Math.random() * failureReasons[payment.paymentMethod].length)] || "Payment processing failed";

            payment.paymentStatus = "failed"
            payment.paymentDetails = {
                ...payment.paymentDetails,
                transactionDetails,
                failedAt: new Date(),
                failureReason: reason,
                processingTime: processingTime,
                gatewayResponse: {
                    status: "failed",
                    responseCode: "51",
                    responseMessage: reason
                }
            }
            await payment.save()

            res.status(400).json({ 
                message: "Payment processing failed",
                paymentStatus: "failed",
                failureReason: reason,
                processingTime: processingTime
            })
        }
    } catch (err) {
        next(err)
    }
}

export async function getPaymentStatus(req, res, next) {
    try {
        const { paymentId } = req.query
        if (!paymentId) return res.status(400).json({ message: "Payment ID missing" })

        const payment = await Payment.findOne({ paymentId }).populate('order user')
        if (!payment) return res.status(404).json({ message: "Payment not found" })

        res.status(200).json({
            paymentId: payment.paymentId,
            amount: payment.amount,
            currency: payment.currency,
            paymentStatus: payment.paymentStatus,
            paymentMethod: payment.paymentMethod,
            orderId: payment.order?.orderId,
            transactionId: payment.transactionId,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
            paymentDetails: payment.paymentDetails
        })
    } catch (err) {
        next(err)
    }
}

// Get available payment methods
export async function getPaymentMethods(req, res, next) {
    try {
        const paymentMethods = [
            {
                id: "card",
                name: "Credit / Debit Cards",
                description: "Pay using Visa, MasterCard, RuPay cards",
                icon: "credit-card",
                enabled: true
            },
            {
                id: "emi",
                name: "Pay in EMI",
                description: "Convert your purchase into easy EMIs",
                icon: "clock",
                enabled: true
            },
            {
                id: "upi",
                name: "UPI",
                description: "Pay using UPI apps like PhonePe, Google Pay",
                icon: "smartphone",
                enabled: true
            },
            {
                id: "netbanking",
                name: "NetBanking",
                description: "Pay using your bank's net banking",
                icon: "building",
                enabled: true
            }
        ];

        res.status(200).json({ paymentMethods });
    } catch (err) {
        next(err)
    }
}

// Get available banks for EMI and NetBanking
export async function getBanks(req, res, next) {
    try {
        const { type = "all" } = req.query;
        
        const banks = [
            { name: "Axis Bank", code: "AXIS", logo: "axis.png", emi: true, netbanking: true },
            { name: "HDFC Bank", code: "HDFC", logo: "hdfc.png", emi: true, netbanking: true },
            { name: "ICICI Bank", code: "ICICI", logo: "icici.png", emi: true, netbanking: true },
            { name: "State Bank of India", code: "SBI", logo: "sbi.png", emi: true, netbanking: true },
            { name: "Bank of Baroda", code: "BOB", logo: "bob.png", emi: true, netbanking: true },
            { name: "Federal Bank", code: "FEDERAL", logo: "federal.png", emi: true, netbanking: true },
            { name: "HSBC Bank", code: "HSBC", logo: "hsbc.png", emi: true, netbanking: true },
            { name: "IDFC FIRST Bank", code: "IDFC", logo: "idfc.png", emi: true, netbanking: true },
            { name: "IndusInd Bank", code: "INDUSIND", logo: "indusind.png", emi: true, netbanking: true },
            { name: "Kotak Mahindra Bank", code: "KOTAK", logo: "kotak.png", emi: true, netbanking: true },
            { name: "Bank of India", code: "BOI", logo: "boi.png", emi: false, netbanking: true },
            { name: "Bank of Maharashtra", code: "BOM", logo: "bom.png", emi: false, netbanking: true },
            { name: "Canara Bank", code: "CANARA", logo: "canara.png", emi: false, netbanking: true },
            { name: "Catholic Syrian Bank", code: "CSB", logo: "csb.png", emi: false, netbanking: true },
            { name: "Central Bank Of India", code: "CBI", logo: "cbi.png", emi: false, netbanking: true }
        ];

        let filteredBanks = banks;
        if (type === "emi") {
            filteredBanks = banks.filter(bank => bank.emi);
        } else if (type === "netbanking") {
            filteredBanks = banks.filter(bank => bank.netbanking);
        }

        res.status(200).json({ banks: filteredBanks });
    } catch (err) {
        next(err)
    }
}

// Generate UPI QR code
export async function generateUPIQR(req, res, next) {
    try {
        const { amount, upiId, merchantName } = req.body;
        
        if (!amount || !upiId) {
            return res.status(400).json({ message: "Amount and UPI ID are required" });
        }

        if (!upiId.includes("@")) {
            return res.status(400).json({ message: "Invalid UPI ID format" });
        }

        const qrData = generateUPIQRData(amount, upiId, merchantName);
        
        // In a real implementation, you would generate an actual QR code image
        // For now, we'll return the QR data that can be used by frontend QR generators
        res.status(200).json({
            qrData: qrData,
            qrImage: `data:image/png;base64,${Buffer.from(qrData).toString('base64')}`,
            amount: amount,
            upiId: upiId,
            merchantName: merchantName || "ShoppyX"
        });
    } catch (err) {
        next(err)
    }
}

// Validate UPI ID
export async function validateUPI(req, res, next) {
    try {
        const { upiId } = req.body;
        
        if (!upiId) {
            return res.status(400).json({ message: "UPI ID is required" });
        }

        // Basic UPI validation
        const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
        const isValid = upiRegex.test(upiId);

        res.status(200).json({
            isValid: isValid,
            message: isValid ? "Valid UPI ID" : "Invalid UPI ID format"
        });
    } catch (err) {
        next(err)
    }
}

// Get user's payment history
export async function getUserPaymentHistory(req, res, next) {
    try {
        const user = req.user
        const { page = 1, limit = 10, status } = req.query

        const query = { user: user._id }
        if (status) {
            query.paymentStatus = status
        }

        const payments = await Payment.find(query)
            .populate('order', 'orderId orderStatus')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()

        const total = await Payment.countDocuments(query)

        res.status(200).json({
            payments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        })
    } catch (err) {
        next(err)
    }
}

// Get payment analytics (for admin)
export async function getPaymentAnalytics(req, res, next) {
    try {
        const today = new Date()
        const startOfDay = new Date(today.setHours(0, 0, 0, 0))
        const endOfDay = new Date(today.setHours(23, 59, 59, 999))

        const todayPayments = await Payment.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            paymentStatus: "completed"
        })

        const totalPayments = await Payment.countDocuments({ paymentStatus: "completed" })
        const pendingPayments = await Payment.countDocuments({ paymentStatus: "pending" })
        const failedPayments = await Payment.countDocuments({ paymentStatus: "failed" })

        const totalAmount = await Payment.aggregate([
            { $match: { paymentStatus: "completed" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])

        // Payment method analytics
        const paymentMethodStats = await Payment.aggregate([
            { $match: { paymentStatus: "completed" } },
            { $group: { _id: "$paymentMethod", count: { $sum: 1 }, total: { $sum: "$amount" } } }
        ])

        res.status(200).json({
            todayPayments: todayPayments.length,
            totalPayments,
            pendingPayments,
            failedPayments,
            totalAmount: totalAmount[0]?.total || 0,
            successRate: totalPayments > 0 ? ((totalPayments - failedPayments) / totalPayments * 100).toFixed(2) : 0,
            paymentMethodStats
        })
    } catch (err) {
        next(err)
    }
}

// Cancel payment
export async function cancelPayment(req, res, next) {
    try {
        const { paymentId } = req.params
        const user = req.user

        const payment = await Payment.findOne({ paymentId, user: user._id })
        if (!payment) return res.status(404).json({ message: "Payment not found" })

        if (payment.paymentStatus !== "pending") {
            return res.status(400).json({ message: "Payment cannot be cancelled" })
        }

        payment.paymentStatus = "cancelled"
        payment.paymentDetails = {
            ...payment.paymentDetails,
            cancelledAt: new Date(),
            cancelledBy: user._id
        }
        await payment.save()

        res.status(200).json({ 
            message: "Payment cancelled successfully",
            paymentStatus: "cancelled"
        })
    } catch (err) {
        next(err)
    }
}

// Refund payment
export async function refundPayment(req, res, next) {
    try {
        const { paymentId } = req.params
        const { reason } = req.body

        const payment = await Payment.findOne({ paymentId }).populate('order')
        if (!payment) return res.status(404).json({ message: "Payment not found" })

        if (payment.paymentStatus !== "completed") {
            return res.status(400).json({ message: "Payment cannot be refunded" })
        }

        // Simulate refund processing
        const isRefundSuccessful = Math.random() > 0.05 // 95% success rate

        if (isRefundSuccessful) {
            payment.paymentStatus = "refunded"
            payment.paymentDetails = {
                ...payment.paymentDetails,
                refundedAt: new Date(),
                refundReason: reason,
                refundId: `REF_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`
            }
            await payment.save()

            // Update order status
            if (payment.order) {
                payment.order.orderStatus = "Refunded"
                await payment.order.save()
            }

            res.status(200).json({ 
                message: "Payment refunded successfully",
                paymentStatus: "refunded",
                refundId: payment.paymentDetails.refundId
            })
        } else {
            res.status(400).json({ 
                message: "Refund processing failed",
                paymentStatus: "refund_failed"
            })
        }
    } catch (err) {
      next(err)
    }
  }
  