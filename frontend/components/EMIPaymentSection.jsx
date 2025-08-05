import React, { useState, useEffect } from "react";
import { Check, CreditCard, Calendar, DollarSign, Lock } from "lucide-react";
import getEMIOptionsService from "../services/emi/getEMIOptionsService.js";
import createEMIPaymentService from "../services/emi/createEMIPaymentService.js";
import successToastMessage from "../utils/successToastMessage.js";
import errorToastMessage from "../utils/errorToastMessage.js";

const EMIPaymentSection = ({ amount, orderId, onPaymentSuccess, onPaymentError }) => {
  const [emiOptions, setEmiOptions] = useState([]);
  const [selectedEMI, setSelectedEMI] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Card form state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardholderName: ""
  });

  useEffect(() => {
    if (amount && amount > 0) {
      fetchEMIOptions();
    }
  }, [amount]);

  const fetchEMIOptions = async () => {
    setIsCalculating(true);
    try {
      const response = await getEMIOptionsService(amount);
      setEmiOptions(response.data);
    } catch (error) {
      console.error("Error fetching EMI options:", error);
      errorToastMessage("Failed to load EMI options");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleEMISelection = (emiOption) => {
    setSelectedEMI(emiOption);
    setShowCardForm(true);
  };

  const handleCardInputChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const isFormValid = () => {
    const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');
    return (
      cardNumber.length === 16 &&
      /^\d{16}$/.test(cardNumber) &&
      /^\d{2}\/\d{2}$/.test(cardDetails.expiry) &&
      /^\d{3,4}$/.test(cardDetails.cvv) &&
      cardDetails.cardholderName.trim().length > 0
    );
  };

  const validateCardDetails = () => {
    // Validate card number (16 digits, remove spaces)
    const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');
    if (!cardNumber || cardNumber.length !== 16 || !/^\d{16}$/.test(cardNumber)) {
      errorToastMessage("Please enter a valid 16-digit card number");
      return false;
    }

    // Validate expiry date (MM/YY format)
    if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      errorToastMessage("Please enter a valid expiry date (MM/YY)");
      return false;
    }

    // Validate CVV (3-4 digits)
    if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) {
      errorToastMessage("Please enter a valid CVV (3-4 digits)");
      return false;
    }

    // Validate cardholder name (not empty)
    if (!cardDetails.cardholderName || !cardDetails.cardholderName.trim()) {
      errorToastMessage("Please enter cardholder name");
      return false;
    }

    return true;
  };

  const handleEMIPayment = async () => {
    if (!selectedEMI) {
      errorToastMessage("Please select an EMI option");
      return;
    }

    if (!validateCardDetails()) {
      return;
    }

    setIsLoading(true);
    try {
      const emiData = {
        orderId,
        tenure: selectedEMI.tenure,
        principalAmount: amount,
        cardDetails: {
          last4Digits: cardDetails.cardNumber.slice(-4),
          expiry: cardDetails.expiry,
          cardholderName: cardDetails.cardholderName
        }
      };

      const response = await createEMIPaymentService(emiData);
      
      if (response.status === "success") {
        setPaymentSuccess(true);
        successToastMessage("Payment successful! EMI has been created.");
        onPaymentSuccess && onPaymentSuccess(response.data);
      }
    } catch (error) {
      console.error("Error creating EMI payment:", error);
      const errorMessage = error.response?.data?.message || "Failed to create EMI payment";
      errorToastMessage(errorMessage);
      onPaymentError && onPaymentError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="bg-white rounded-lg border border-green-200 p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600 mb-4">
            Your EMI payment has been processed successfully.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between mb-1">
                <span>EMI Amount:</span>
                <span className="font-medium">₹{selectedEMI?.monthlyEMI.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Tenure:</span>
                <span className="font-medium">{selectedEMI?.tenure} months</span>
              </div>
              <div className="flex justify-between">
                <span>Next Payment:</span>
                <span className="font-medium">1 month from now</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/emi-dashboard'}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View EMI Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isCalculating) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Calculating EMI options...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* EMI Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Check className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Pay in EMI</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Choose your preferred EMI plan
        </p>
      </div>

      {/* EMI Options */}
      <div className="p-4">
        <div className="space-y-3">
          {emiOptions.map((option, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedEMI?.tenure === option.tenure
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleEMISelection(option)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="emiOption"
                    checked={selectedEMI?.tenure === option.tenure}
                    onChange={() => handleEMISelection(option)}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">
                      ₹{option.monthlyEMI.toLocaleString('en-IN')} x {option.tenure} M | @{option.interestRate}% p.a
                    </div>
                    <div className="text-sm text-gray-500">
                      Total ₹{option.totalInterest.toLocaleString('en-IN')} interest charged
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    ₹{option.monthlyEMI.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-gray-500">per month</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Card Details Form */}
        {showCardForm && selectedEMI && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Credit / Debit Cards
            </h4>
            
            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) => handleCardInputChange('cardNumber', formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    maxLength="19"
                  />
                  <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => handleCardInputChange('expiry', formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    maxLength="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      maxLength="4"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400 cursor-help">?</span>
                  </div>
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  value={cardDetails.cardholderName}
                  onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                  placeholder="Enter card holder name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Payment Button */}
              <div className="mt-6">
                <button
                  onClick={handleEMIPayment}
                  disabled={isLoading || !isFormValid()}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                    !isLoading && isFormValid()
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Payment"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EMI Summary */}
        {selectedEMI && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Price Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Value:</span>
                <span className="font-medium">₹{amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payable Now*:</span>
                <span className="font-medium">₹{amount.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                *We do not levy any charges for availing EMI. Charges (if any) are levied by the bank.
              </div>
            </div>
          </div>
        )}



        {/* Security Note */}
        <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
          <Lock className="w-3 h-3 mr-1" />
          Your payment information is secure and encrypted
        </div>
      </div>
    </div>
  );
};

export default EMIPaymentSection; 