import mongoose from "mongoose";

const emiSchema = new mongoose.Schema({
    emiId: {
        type: String,
        unique: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true
    },
    principalAmount: {
        type: Number,
        required: true
    },
    tenure: {
        type: Number,
        required: true, // 3, 6, 9, 12, 18, 24 months
        enum: [3, 6, 9, 12, 18, 24]
    },
    interestRate: {
        type: Number,
        required: true, // Annual interest rate
        default: 16.00
    },
    monthlyEMI: {
        type: Number,
        required: true
    },
    totalInterest: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    emiStatus: {
        type: String,
        enum: ["active", "completed", "defaulted"],
        default: "active"
    },
    nextPaymentDate: {
        type: Date,
        required: true
    },
    remainingPayments: {
        type: Number,
        required: true
    },
    paymentHistory: [{
        paymentNumber: Number,
        amount: Number,
        dueDate: Date,
        paidDate: Date,
        status: {
            type: String,
            enum: ["paid", "pending", "overdue"],
            default: "pending"
        }
    }]
}, { timestamps: true });

emiSchema.pre("save", async function(next) {
    if (!this.isNew) return next();
    const emiCount = await mongoose.model("EMI").countDocuments();
    this.emiId = "EMI" + String(emiCount + 1).padStart(5, "0");
    
    // Calculate next payment date (1 month from now)
    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    this.nextPaymentDate = nextPaymentDate;
    
    // Set remaining payments equal to tenure
    this.remainingPayments = this.tenure;
    
    // Initialize payment history
    this.paymentHistory = [];
    for (let i = 1; i <= this.tenure; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i);
        this.paymentHistory.push({
            paymentNumber: i,
            amount: this.monthlyEMI,
            dueDate: dueDate,
            status: "pending"
        });
    }
    
    next();
});

const EMI = mongoose.model("EMI", emiSchema);
export default EMI; 