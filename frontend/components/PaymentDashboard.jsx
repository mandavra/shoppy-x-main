import { useState, useEffect } from "react";
import { 
    CreditCard, 
    Calendar, 
    DollarSign, 
    TrendingUp, 
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    RefreshCw,
    Filter,
    Search,
    Download,
    Eye,
    Trash2
} from "lucide-react";
import { 
    getUserPaymentHistory, 
    getPaymentAnalytics,
    cancelPayment,
    refundPayment,
    formatPaymentAmount, 
    getPaymentStatusColor, 
    getPaymentStatusText,
    PAYMENT_STATUS 
} from "../services/payment/paymentService.js";
import successToastMessage from "../utils/successToastMessage.js";
import errorToastMessage from "../utils/errorToastMessage.js";

function PaymentDashboard() {
    const [payments, setPayments] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);

    useEffect(() => {
        fetchPayments();
        fetchAnalytics();
    }, [currentPage, statusFilter]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                ...(statusFilter && { status: statusFilter })
            };
            
            const data = await getUserPaymentHistory(params);
            setPayments(data.payments);
            setTotalPages(data.totalPages);
            setTotal(data.total);
        } catch (error) {
            console.error("Error fetching payments:", error);
            errorToastMessage("Failed to load payment history");
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            setAnalyticsLoading(true);
            const data = await getPaymentAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setAnalyticsLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status === statusFilter ? "" : status);
        setCurrentPage(1);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        // Implement search functionality
    };

    const handleCancelPayment = async (paymentId) => {
        try {
            await cancelPayment(paymentId);
            successToastMessage("Payment cancelled successfully");
            fetchPayments();
            fetchAnalytics();
        } catch (error) {
            errorToastMessage("Failed to cancel payment");
        }
    };

    const handleRefundPayment = async (paymentId, reason) => {
        try {
            await refundPayment(paymentId, reason);
            successToastMessage("Refund request submitted successfully");
            fetchPayments();
            fetchAnalytics();
        } catch (error) {
            errorToastMessage("Failed to process refund");
        }
    };

    const handleViewPaymentDetails = (payment) => {
        setSelectedPayment(payment);
        setShowPaymentDetails(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case PAYMENT_STATUS.COMPLETED:
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case PAYMENT_STATUS.PENDING:
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case PAYMENT_STATUS.FAILED:
                return <XCircle className="w-5 h-5 text-red-500" />;
            case PAYMENT_STATUS.CANCELLED:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
            case PAYMENT_STATUS.REFUNDED:
                return <RefreshCw className="w-5 h-5 text-blue-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    if (loading && analyticsLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Analytics Section */}
            {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Today's Payments</p>
                                <p className="text-2xl font-bold text-gray-900">{analytics.todayPayments}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                                <p className="text-2xl font-bold text-gray-900">{analytics.totalPayments}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <CreditCard className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{analytics.totalAmount.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                                <p className="text-2xl font-bold text-gray-900">{analytics.successRate}%</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment History Section */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
                            <p className="text-gray-600">View and manage your payment transactions</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filter</span>
                            </button>
                            <button
                                onClick={fetchPayments}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="mt-4 flex items-center space-x-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search payments..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Status Filters */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-3">Filter by Status</h3>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(PAYMENT_STATUS).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusFilter(status)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            statusFilter === status
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        {getPaymentStatusText(status)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment List */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="text-center py-12">
                            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                            <p className="text-gray-600">
                                {statusFilter 
                                    ? `No ${getPaymentStatusText(statusFilter).toLowerCase()} payments found`
                                    : "You haven't made any payments yet"
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {payments.map((payment) => (
                                <div key={payment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            {getStatusIcon(payment.paymentStatus)}
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    Payment #{payment.paymentId}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(payment.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">
                                                    {formatPaymentAmount(payment.amount, payment.currency)}
                                                </p>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.paymentStatus)}`}>
                                                    {getPaymentStatusText(payment.paymentStatus)}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleViewPaymentDetails(payment)}
                                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                
                                                {payment.paymentStatus === PAYMENT_STATUS.PENDING && (
                                                    <button
                                                        onClick={() => handleCancelPayment(payment.paymentId)}
                                                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                                        title="Cancel Payment"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                
                                                {payment.paymentStatus === PAYMENT_STATUS.COMPLETED && (
                                                    <button
                                                        onClick={() => handleRefundPayment(payment.paymentId, "Customer request")}
                                                        className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                                                        title="Request Refund"
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">Method:</span> {payment.paymentMethod}
                                        </div>
                                        {payment.order && (
                                            <div>
                                                <span className="font-medium">Order:</span> #{payment.order.orderId}
                                            </div>
                                        )}
                                        {payment.transactionId && (
                                            <div>
                                                <span className="font-medium">TXN:</span> {payment.transactionId}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-600">
                                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, total)} of {total} payments
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            currentPage === page
                                                ? "bg-blue-600 text-white"
                                                : "border border-gray-300 hover:bg-gray-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Details Modal */}
            {showPaymentDetails && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
                            <button
                                onClick={() => setShowPaymentDetails(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Payment ID</p>
                                    <p className="text-gray-900">{selectedPayment.paymentId}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Amount</p>
                                    <p className="text-gray-900">{formatPaymentAmount(selectedPayment.amount, selectedPayment.currency)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Status</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedPayment.paymentStatus)}`}>
                                        {getPaymentStatusText(selectedPayment.paymentStatus)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Method</p>
                                    <p className="text-gray-900 capitalize">{selectedPayment.paymentMethod}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Created</p>
                                    <p className="text-gray-900">{formatDate(selectedPayment.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Updated</p>
                                    <p className="text-gray-900">{formatDate(selectedPayment.updatedAt)}</p>
                                </div>
                            </div>
                            
                            {selectedPayment.transactionId && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Transaction ID</p>
                                    <p className="text-gray-900 font-mono text-sm">{selectedPayment.transactionId}</p>
                                </div>
                            )}
                            
                            {selectedPayment.paymentDetails && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">Payment Details</p>
                                    <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
                                        {JSON.stringify(selectedPayment.paymentDetails, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PaymentDashboard; 