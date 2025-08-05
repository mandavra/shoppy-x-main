import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "INR"
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "cancelled"],
        default: "pending"
    },
    transactionId: {
        type: String
    },
    paymentDetails: {
        type: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true });

paymentSchema.pre("save", async function(next) {
    if (!this.isNew) return next();
    const paymentCount = await mongoose.model("Payment").countDocuments();
    this.paymentId = "PAY" + String(paymentCount + 1).padStart(5, "0");
    next();
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment; 