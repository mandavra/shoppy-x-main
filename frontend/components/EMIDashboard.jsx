import React, { useState, useEffect } from "react";
import { Calendar, DollarSign, CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react";
import getUserEMIsService from "../services/emi/getUserEMIsService.js";
import errorToastMessage from "../utils/errorToastMessage.js";

const EMIDashboard = () => {
  const [emis, setEmis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEMI, setSelectedEMI] = useState(null);

  useEffect(() => {
    fetchUserEMIs();
  }, []);

  const fetchUserEMIs = async () => {
    setIsLoading(true);
    try {
      const response = await getUserEMIsService();
      setEmis(response.data);
    } catch (error) {
      console.error("Error fetching EMIs:", error);
      errorToastMessage("Failed to load EMI details");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "defaulted":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "defaulted":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading EMI details...</span>
      </div>
    );
  }

  if (emis.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No EMI Payments</h3>
        <p className="text-gray-500">You don't have any EMI payments yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My EMI Payments</h2>
        <button
          onClick={fetchUserEMIs}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-6">
        {emis.map((emi) => (
          <div key={emi._id} className="bg-white rounded-lg border border-gray-200 p-6">
            {/* EMI Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(emi.emiStatus)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    EMI ID: {emi.emiId}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Order: {emi.order?.orderId}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(emi.emiStatus)}`}>
                {emi.emiStatus.charAt(0).toUpperCase() + emi.emiStatus.slice(1)}
              </span>
            </div>

            {/* EMI Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Principal Amount</span>
                </div>
                <div className="text-xl font-bold text-gray-800">
                  ₹{emi.principalAmount.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Tenure</span>
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {emi.tenure} months
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <CreditCard className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Monthly EMI</span>
                </div>
                <div className="text-xl font-bold text-indigo-600">
                  ₹{emi.monthlyEMI.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Payment Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Payment Progress</span>
                <span className="text-sm text-gray-500">
                  {emi.tenure - emi.remainingPayments} of {emi.tenure} payments
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((emi.tenure - emi.remainingPayments) / emi.tenure) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Payment History */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Payment History</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {emi.paymentHistory.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        payment.status === 'paid' ? 'bg-green-500' :
                        payment.status === 'overdue' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-800">
                          Payment {payment.paymentNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          Due: {formatDate(payment.dueDate)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-800">
                        ₹{payment.amount.toLocaleString('en-IN')}
                      </div>
                      <div className={`text-sm ${
                        payment.status === 'paid' ? 'text-green-600' :
                        payment.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Payment Info */}
            {emi.emiStatus === 'active' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-blue-800">Next Payment</div>
                    <div className="text-sm text-blue-600">
                      Due on {formatDate(emi.nextPaymentDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-800">
                      ₹{emi.monthlyEMI.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-blue-600">
                      {emi.remainingPayments} payments remaining
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EMIDashboard; 