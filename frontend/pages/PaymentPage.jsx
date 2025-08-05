import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { 
    CreditCard, 
    Smartphone, 
    Building2, 
    QrCode, 
    Search,
    ChevronRight,
    Check,
    Shield,
    Clock,
    Truck,
    AlertCircle,
    CheckCircle
} from "lucide-react";
import { 
    createPaymentSession, 
    processPayment, 
    getBanks, 
    generateUPIQR, 
    validateUPI,
    validateCardNumber,
    validateExpiryDate,
    validateCVV,
    formatCardNumber,
    PAYMENT_METHODS
} from "../services/payment/paymentService.js";
import EMIPaymentSection from "../components/EMIPaymentSection.jsx";
import successToastMessage from "../utils/successToastMessage.js";
import errorToastMessage from "../utils/errorToastMessage.js";

function PaymentPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
    const [selectedBank, setSelectedBank] = useState("");
    const [upiId, setUpiId] = useState("");
    const [saveUpiId, setSaveUpiId] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [validationErrors, setValidationErrors] = useState({});

    // Card form fields
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");

    // Mock order data - in real app, this would come from cart or previous page
    const mockOrderData = {
        products: [
            {
                name: "Croma 80 cm (32 inch) HD Ready LED TV with Bezel Less Display",
                price: 7390,
                quantity: 1,
                image: "https://via.placeholder.com/80x80?text=TV",
                deliveryDate: "7 August 2025"
            },
            {
                name: "Croma 6.5 kg 5 Star Fully Automatic Top Load Washing Machine",
                price: 11290,
                quantity: 1,
                image: "https://via.placeholder.com/80x80?text=WM",
                deliveryDate: "7 August 2025"
            }
        ],
        totalPrice: 18680,
        savings: 400,
        deliveryCharges: 0,
        finalPrice: 18280,
        shippingAddress: {
            name: "Whoopi Cherry",
            tag: "WORK",
            address: "Omnis Culpa Vel Voluptas Ut A Porro Beatae, Do Amet Excepturi Quaerat Voluptatem Dolorem Unde Ut Magni, Deleniti Pariatur Voluptate Sit Perspiciatis Doloremque Beatae Ut Et Sunt, Surat, Gujarat - 395006"
        }
    };

    useEffect(() => {
        // Get order data from navigation state or use mock data
        const orderDataFromState = location.state?.orderData;
        if (orderDataFromState) {
            // Transform cart data to match the expected format
            const transformedOrderData = {
                products: orderDataFromState.products.map(product => ({
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    image: product.image,
                    deliveryDate: "7 August 2025"
                })),
                totalPrice: orderDataFromState.totalPrice,
                savings: 400, // Mock savings
                deliveryCharges: 0,
                finalPrice: orderDataFromState.finalPrice,
                shippingAddress: {
                    name: "Whoopi Cherry",
                    tag: "WORK",
                    address: "Omnis Culpa Vel Voluptas Ut A Porro Beatae, Do Amet Excepturi Quaerat Voluptatem Dolorem Unde Ut Magni, Deleniti Pariatur Voluptate Sit Perspiciatis Doloremque Beatae Ut Et Sunt, Surat, Gujarat - 395006"
                }
            };
            setOrderData(transformedOrderData);
        } else {
            setOrderData(mockOrderData);
        }
        setLoading(false);
    }, [location.state]);

    // Load banks when component mounts
    useEffect(() => {
        loadBanks();
    }, []);

    const loadBanks = async () => {
        try {
            const bankType = selectedPaymentMethod === "emi" ? "emi" : "netbanking";
            const response = await getBanks(bankType);
            setBanks(response.banks || []);
        } catch (error) {
            console.error("Error loading banks:", error);
        }
    };

    const paymentMethods = [
        { id: "card", name: "Credit / Debit Cards", icon: CreditCard },
        { id: "emi", name: "Pay in EMI", icon: Clock },
        { id: "upi", name: "UPI", icon: Smartphone },
        { id: "netbanking", name: "NetBanking", icon: Building2 }
    ];

    const upiApps = [
        { name: "PhonePe", logo: "https://via.placeholder.com/40x40?text=PP", color: "bg-purple-500" },
        { name: "Google Pay", logo: "https://via.placeholder.com/40x40?text=GP", color: "bg-blue-500" },
        { name: "Paytm", logo: "https://via.placeholder.com/40x40?text=PT", color: "bg-blue-600" },
        { name: "BHIM", logo: "https://via.placeholder.com/40x40?text=BH", color: "bg-green-600" },
        { name: "Amazon Pay", logo: "https://via.placeholder.com/40x40?text=AP", color: "bg-orange-500" },
        { name: "Mobikwik", logo: "https://via.placeholder.com/40x40?text=MK", color: "bg-blue-400" }
    ];

    const handlePaymentMethodChange = (methodId) => {
        setSelectedPaymentMethod(methodId);
        setSelectedBank("");
        setUpiId("");
        setShowQRCode(false);
        setValidationErrors({});
        loadBanks();
    };

    const handleBankSelection = (bank) => {
        setSelectedBank(bank);
        setValidationErrors(prev => ({ ...prev, bank: null }));
    };

    const handleGenerateQR = async () => {
        if (!orderData) return;
        
        try {
            const qrData = {
                amount: orderData.finalPrice,
                upiId: upiId || "merchant@upi",
                merchantName: "ShoppyX"
            };
            
            const response = await generateUPIQR(qrData);
            setShowQRCode(true);
            successToastMessage("QR Code generated successfully!");
        } catch (error) {
            errorToastMessage("Failed to generate QR code");
        }
    };

    const validateForm = () => {
        const errors = {};

        switch (selectedPaymentMethod) {
            case "card":
                if (!cardNumber) errors.cardNumber = "Card number is required";
                else if (!validateCardNumber(cardNumber)) errors.cardNumber = "Invalid card number";
                
                if (!expiryDate) errors.expiryDate = "Expiry date is required";
                else if (!validateExpiryDate(expiryDate)) errors.expiryDate = "Invalid expiry date";
                
                if (!cvv) errors.cvv = "CVV is required";
                else if (!validateCVV(cvv)) errors.cvv = "Invalid CVV";
                
                if (!cardHolderName) errors.cardHolderName = "Card holder name is required";
                break;

            case "upi":
                if (!upiId) errors.upiId = "UPI ID is required";
                else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(upiId)) {
                    errors.upiId = "Please enter a valid UPI ID (e.g., username@bank)";
                }
                break;

            case "netbanking":
            case "emi":
                if (!selectedBank) errors.bank = "Please select a bank";
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCardNumberChange = (value) => {
        const formatted = formatCardNumber(value);
        setCardNumber(formatted);
        if (validationErrors.cardNumber) {
            setValidationErrors(prev => ({ ...prev, cardNumber: null }));
        }
    };

    const handleExpiryDateChange = (value) => {
        // Auto-format expiry date
        let formatted = value.replace(/\D/g, '');
        if (formatted.length >= 2) {
            formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
        }
        setExpiryDate(formatted);
        if (validationErrors.expiryDate) {
            setValidationErrors(prev => ({ ...prev, expiryDate: null }));
        }
    };

    const handleCVVChange = (value) => {
        const numeric = value.replace(/\D/g, '');
        setCvv(numeric);
        if (validationErrors.cvv) {
            setValidationErrors(prev => ({ ...prev, cvv: null }));
        }
    };

    const handleUPIIdChange = (value) => {
        setUpiId(value);
        if (validationErrors.upiId) {
            setValidationErrors(prev => ({ ...prev, upiId: null }));
        }
    };

    const handlePayNow = async () => {
        if (!orderData) return;

        if (!validateForm()) {
            errorToastMessage("Please fix the validation errors");
            return;
        }

        setIsProcessing(true);
        try {
            // Create payment session
            const paymentData = await createPaymentSession({
                products: orderData.products,
                totalPrice: orderData.totalPrice,
                finalPrice: orderData.finalPrice,
                paymentMethod: selectedPaymentMethod
            });

            if (paymentData?.paymentId) {
                // Prepare transaction details based on payment method
                let transactionDetails = {
                    method: selectedPaymentMethod,
                    timestamp: new Date().toISOString()
                };

                switch (selectedPaymentMethod) {
                    case "card":
                        transactionDetails = {
                            ...transactionDetails,
                            cardNumber: cardNumber.replace(/\s/g, ''),
                            expiryDate,
                            cvv,
                            cardHolderName
                        };
                        break;
                    case "upi":
                        transactionDetails = {
                            ...transactionDetails,
                            upiId
                        };
                        break;
                    case "netbanking":
                    case "emi":
                        transactionDetails = {
                            ...transactionDetails,
                            bankName: selectedBank
                        };
                        break;
                }

                // Process payment
                const result = await processPayment({
                    paymentId: paymentData.paymentId,
                    transactionDetails
                });

                if (result?.paymentStatus === "completed") {
                    successToastMessage("Payment completed successfully!");
                    navigate("/payment-success?paymentId=" + paymentData.paymentId);
                } else {
                    errorToastMessage(result?.failureReason || "Payment failed. Please try again.");
                }
            }
        } catch (error) {
            errorToastMessage("Payment processing error. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No Order Data</h2>
                    <p className="text-gray-600">Please add items to cart and try again.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Payable amount</p>
                                <p className="text-2xl font-bold text-gray-900">₹{orderData.finalPrice.toLocaleString()}</p>
                            </div>
                            <button
                                onClick={handlePayNow}
                                disabled={isProcessing}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                            >
                                {isProcessing ? "Processing..." : "Pay Now"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Methods - Left Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
                            </div>

                            <div className="flex">
                                {/* Payment Method Navigation */}
                                <div className="w-64 border-r border-gray-200">
                                    <div className="p-4">
                                        {paymentMethods.map((method) => {
                                            const Icon = method.icon;
                                            return (
                                                <button
                                                    key={method.id}
                                                    onClick={() => handlePaymentMethodChange(method.id)}
                                                    className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                                                        selectedPaymentMethod === method.id
                                                            ? "bg-green-50 text-green-700 border border-green-200"
                                                            : "hover:bg-gray-50 text-gray-700"
                                                    }`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    <span className="font-medium">{method.name}</span>
                                                    {method.id === "emi" && (
                                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">%</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Payment Method Content */}
                                <div className="flex-1 p-6">
                                    {selectedPaymentMethod === "card" && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Credit / Debit Cards</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Card Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={cardNumber}
                                                        onChange={(e) => handleCardNumberChange(e.target.value)}
                                                        placeholder="1234 5678 9012 3456"
                                                        maxLength="19"
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                                            validationErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    />
                                                    {validationErrors.cardNumber && (
                                                        <p className="text-red-500 text-sm mt-1">{validationErrors.cardNumber}</p>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Expiry Date
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={expiryDate}
                                                            onChange={(e) => handleExpiryDateChange(e.target.value)}
                                                            placeholder="MM/YY"
                                                            maxLength="5"
                                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                                                validationErrors.expiryDate ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        />
                                                        {validationErrors.expiryDate && (
                                                            <p className="text-red-500 text-sm mt-1">{validationErrors.expiryDate}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            CVV
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={cvv}
                                                            onChange={(e) => handleCVVChange(e.target.value)}
                                                            placeholder="123"
                                                            maxLength="4"
                                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                                                validationErrors.cvv ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        />
                                                        {validationErrors.cvv && (
                                                            <p className="text-red-500 text-sm mt-1">{validationErrors.cvv}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Card Holder Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={cardHolderName}
                                                        onChange={(e) => setCardHolderName(e.target.value)}
                                                        placeholder="Enter card holder name"
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                                            validationErrors.cardHolderName ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    />
                                                    {validationErrors.cardHolderName && (
                                                        <p className="text-red-500 text-sm mt-1">{validationErrors.cardHolderName}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedPaymentMethod === "emi" && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Credit Card EMI</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {banks.slice(0, 8).map((bank) => (
                                                    <button
                                                        key={bank.name}
                                                        onClick={() => handleBankSelection(bank.name)}
                                                        className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                                                            selectedBank === bank.name
                                                                ? "border-green-500 bg-green-50"
                                                                : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 bg-gray-200 rounded"></div>
                                                            <span className="font-medium">{bank.name}</span>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                ))}
                                            </div>
                                            {validationErrors.bank && (
                                                <p className="text-red-500 text-sm mt-1">{validationErrors.bank}</p>
                                            )}
                                        </div>
                                    )}

                                    {selectedPaymentMethod === "upi" && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold text-gray-900">Pay by any UPI app</h3>
                                            
                                            <div className="text-center">
                                                <p className="text-gray-600 mb-4">
                                                    Scan the QR using any UPI app on your mobile phone like PhonePe, Paytm, GooglePay, BHIM, etc
                                                </p>
                                                
                                                <div className="grid grid-cols-3 gap-4 mb-6">
                                                    {upiApps.map((app) => (
                                                        <div key={app.name} className="text-center">
                                                            <div className={`w-12 h-12 ${app.color} rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm`}>
                                                                {app.name.charAt(0)}
                                                            </div>
                                                            <span className="text-xs text-gray-600">{app.name}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={handleGenerateQR}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                                >
                                                    Generate QR Code
                                                </button>

                                                {showQRCode && (
                                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                        <QrCode className="w-32 h-32 mx-auto text-gray-400" />
                                                        <p className="text-sm text-gray-600 mt-2">Scan this QR code with your UPI app</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="border-t pt-6">
                                                <p className="text-center text-gray-500 mb-4">OR</p>
                                                
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            UPI ID / VPA
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={upiId}
                                                            onChange={(e) => handleUPIIdChange(e.target.value)}
                                                            placeholder="e.g rakesh@upi"
                                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                                                validationErrors.upiId ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        />
                                                        {validationErrors.upiId && (
                                                            <p className="text-red-500 text-sm mt-1">{validationErrors.upiId}</p>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        A collect request will be sent to this UPI ID
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Format: username@bank (e.g., john@okicici, rakesh@paytm)
                                                    </p>
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={saveUpiId}
                                                            onChange={(e) => setSaveUpiId(e.target.checked)}
                                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                        />
                                                        <span className="text-sm text-gray-700">Save this UPI ID for faster payments</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedPaymentMethod === "emi" && (
                                        <EMIPaymentSection
                                            amount={orderData.finalPrice}
                                            orderId={orderData.orderId || "ORD00001"}
                                            onPaymentSuccess={(data) => {
                                                successToastMessage("EMI payment successful!");
                                                navigate("/payment-success", { 
                                                    state: { 
                                                        paymentData: data,
                                                        orderData: orderData 
                                                    } 
                                                });
                                            }}
                                            onPaymentError={(error) => {
                                                errorToastMessage("EMI payment failed. Please try again.");
                                            }}
                                        />
                                    )}

                                    {selectedPaymentMethod === "netbanking" && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">NetBanking</h3>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                {banks.slice(0, 4).map((bank) => (
                                                    <button
                                                        key={bank.name}
                                                        onClick={() => handleBankSelection(bank.name)}
                                                        className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors ${
                                                            selectedBank === bank.name
                                                                ? "border-green-500 bg-green-50"
                                                                : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                    >
                                                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                                                        <span className="font-medium">{bank.name}</span>
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input
                                                    type="text"
                                                    placeholder="Search"
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {banks.map((bank) => (
                                                    <label key={bank.name} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="bank"
                                                            value={bank.name}
                                                            checked={selectedBank === bank.name}
                                                            onChange={() => handleBankSelection(bank.name)}
                                                            className="text-green-600 focus:ring-green-500"
                                                        />
                                                        <span className="font-medium">{bank.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {validationErrors.bank && (
                                                <p className="text-red-500 text-sm mt-1">{validationErrors.bank}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary - Right Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                            {/* Products */}
                            <div className="space-y-4 mb-6">
                                {orderData.products.map((product, index) => (
                                    <div key={index} className="flex space-x-4">
                                        <div className="w-20 h-20 rounded-lg flex-shrink-0 overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                                ₹{product.price.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Qty: {product.quantity}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Delivery by {product.deliveryDate} | Free
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Shipping Address */}
                            <div className="border-t pt-6 mb-6">
                                <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="font-medium">{orderData.shippingAddress.name}</span>
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            {orderData.shippingAddress.tag}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {orderData.shippingAddress.address}
                                    </p>
                                </div>
                            </div>

                            {/* Amount Details */}
                            <div className="border-t pt-6 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Amount Payable</span>
                                    <span className="font-medium">₹{orderData.totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Savings</span>
                                    <span>-₹{orderData.savings.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery charges</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between">
                                    <span className="font-semibold text-lg">Net Amount</span>
                                    <span className="font-semibold text-lg">₹{orderData.finalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    Instant discount offers on Apple, Oneplus and Samsung mobiles and devices will be applied on the verification page (OTP)
                                </p>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="mt-6 text-sm text-gray-600">
                                By placing the order you have read & agreed to{" "}
                                <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                                    Terms and Conditions
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage; 