import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create payment session
export const createPaymentSession = async (orderData) => {
    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/payments/create-payment-session`,
            orderData,
            { withCredentials: true }
        );
        return data;
    } catch (err) {
        console.error("Create payment session error:", err);
        throw err;
    }
};

// Process payment
export const processPayment = async (paymentData) => {
    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/payments/process-payment`,
            paymentData,
            { withCredentials: true }
        );
        return data;
    } catch (err) {
        console.error("Process payment error:", err);
        throw err;
    }
};

// Get payment status
export const getPaymentStatus = async (paymentId) => {
    try {
        const { data } = await axios.get(
            `${API_BASE_URL}/payments/payment-status?paymentId=${paymentId}`,
            { withCredentials: true }
        );
        return data;
    } catch (err) {
        console.error("Get payment status error:", err);
        throw err;
    }
};

// Get available payment methods
export const getPaymentMethods = async () => {
    try {
        const { data } = await axios.get(
            `${API_BASE_URL}/payments/payment-methods`
        );
        return data;
    } catch (err) {
        console.error("Get payment methods error:", err);
        throw err;
    }
};

// Get available banks
export const getBanks = async (type = "all") => {
    try {
        const { data } = await axios.get(
            `${API_BASE_URL}/payments/banks?type=${type}`
        );
        return data;
    } catch (err) {
        console.error("Get banks error:", err);
        throw err;
    }
};

// Generate UPI QR code
export const generateUPIQR = async (qrData) => {
    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/payments/generate-upi-qr`,
            qrData,
            { withCredentials: true }
        );
        return data;
    } catch (err) {
        console.error("Generate UPI QR error:", err);
        throw err;
    }
};

// Validate UPI ID
export const validateUPI = async (upiId) => {
    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/payments/validate-upi`,
            { upiId }
        );
        return data;
    } catch (err) {
        console.error("Validate UPI error:", err);
        throw err;
    }
};

// Get user payment history
export const getUserPaymentHistory = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams(params).toString();
        const { data } = await axios.get(
            `${API_BASE_URL}/payments/payment-history?${queryParams}`,
            { withCredentials: true }
        );
        return data;
    } catch (err) {
        console.error("Get payment history error:", err);
        throw err;
    }
};

// Get payment analytics
export const getPaymentAnalytics = async () => {
    try {
        const { data } = await axios.get(
            `${API_BASE_URL}/payments/analytics`,
            { withCredentials: true }
        );
        return data;
    } catch (err) {
        console.error("Get payment analytics error:", err);
        throw err;
    }
};

// Cancel payment
export const cancelPayment = async (paymentId) => {
    try {
        const { data } = await axios.put(
            `${API_BASE_URL}/payments/cancel/${paymentId}`,
            {},
            { withCredentials: true }
        );
        return data;
    } catch (err) {
        console.error("Cancel payment error:", err);
        throw err;
    }
};

// Refund payment
export const refundPayment = async (paymentId, reason) => {
    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/payments/refund/${paymentId}`,
            { reason },
            { withCredentials: true }
        );
        return data;
    } catch (err) {
        console.error("Refund payment error:", err);
        throw err;
    }
};

// Payment status constants
export const PAYMENT_STATUS = {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
    CANCELLED: "cancelled",
    REFUNDED: "refunded"
};

// Payment method constants
export const PAYMENT_METHODS = {
    CARD: "card",
    UPI: "upi",
    NET_BANKING: "netbanking",
    EMI: "emi"
};

// Format payment amount
export const formatPaymentAmount = (amount, currency = "INR") => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

// Get payment status color
export const getPaymentStatusColor = (status) => {
    switch (status) {
        case PAYMENT_STATUS.COMPLETED:
            return "text-green-600 bg-green-100";
        case PAYMENT_STATUS.PENDING:
            return "text-yellow-600 bg-yellow-100";
        case PAYMENT_STATUS.FAILED:
            return "text-red-600 bg-red-100";
        case PAYMENT_STATUS.CANCELLED:
            return "text-gray-600 bg-gray-100";
        case PAYMENT_STATUS.REFUNDED:
            return "text-blue-600 bg-blue-100";
        default:
            return "text-gray-600 bg-gray-100";
    }
};

// Get payment status text
export const getPaymentStatusText = (status) => {
    switch (status) {
        case PAYMENT_STATUS.COMPLETED:
            return "Completed";
        case PAYMENT_STATUS.PENDING:
            return "Pending";
        case PAYMENT_STATUS.FAILED:
            return "Failed";
        case PAYMENT_STATUS.CANCELLED:
            return "Cancelled";
        case PAYMENT_STATUS.REFUNDED:
            return "Refunded";
        default:
            return "Unknown";
    }
};

// Validate card number (Luhn algorithm)
export const validateCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(cleaned)) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
};

// Validate expiry date
export const validateExpiryDate = (expiryDate) => {
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) return false;
    
    return true;
};

// Validate CVV
export const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
};

// Format card number with spaces
export const formatCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
};

// Mask card number
export const maskCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length < 8) return cleaned;
    return cleaned.slice(0, 4) + ' **** **** ' + cleaned.slice(-4);
}; 