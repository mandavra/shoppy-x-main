import { useState, useEffect } from "react";
import { 
    getUserPaymentHistory, 
    formatPaymentAmount, 
    getPaymentStatusColor, 
    getPaymentStatusText,
    PAYMENT_STATUS 
} from "../services/payment/paymentService.js";
import { Calendar, Clock, CreditCard, Filter, ChevronLeft, ChevronRight } from "lucide-react";

function PaymentHistory() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);

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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [currentPage, statusFilter]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status === statusFilter ? "" : status);
        setCurrentPage(1);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
                    <p className="text-gray-600">View all your payment transactions</p>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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

            {/* Payment List */}
            {payments.length === 0 ? (
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
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="font-semibold text-gray-900">
                                            Payment #{payment.paymentId}
                                        </h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.paymentStatus)}`}>
                                            {getPaymentStatusText(payment.paymentStatus)}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(payment.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CreditCard className="w-4 h-4" />
                                            <span className="capitalize">{payment.paymentMethod}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium text-gray-900">
                                                {formatPaymentAmount(payment.amount, payment.currency)}
                                            </span>
                                        </div>
                                    </div>

                                    {payment.order && (
                                        <div className="mt-2 text-sm text-gray-500">
                                            Order: #{payment.order.orderId}
                                        </div>
                                    )}

                                    {payment.transactionId && (
                                        <div className="mt-1 text-xs text-gray-400">
                                            TXN: {payment.transactionId}
                                        </div>
                                    )}
                                </div>
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
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
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
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PaymentHistory; 