import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { CheckCircle, Loader2 } from "lucide-react"
import verifyPaymentService from "../services/payment/verifyPaymentService"
import successToastMessage from "../utils/successToastMessage"

function PaymentSuccess() {
  const [params] = useSearchParams()
  const paymentId = params.get("paymentId")
  const navigate = useNavigate()

  async function verifySession(){
    try {
      const data = await verifyPaymentService(paymentId)
      // console.log(data.message)
      if(data?.paymentStatus === "completed") {
        successToastMessage("Order Confirmed")
        navigate("/profile?tab=orders")
      } else {
        console.error("Payment not completed")
        navigate("/checkout")
      }
    } catch (err) {
        console.error("Verification failed", err)
        navigate("/checkout")
    }
}

  useEffect(() => {
    if(paymentId) verifySession()
  }, [paymentId, navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <h1 className="text-2xl font-bold text-white text-center">
            Payment Processing
          </h1>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Animated Loader */}
            <div className="relative h-24 w-24">
              <Loader2 className="h-full w-full text-blue-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-blue-600 rounded-full animate-ping" />
              </div>
            </div>

            {/* Status Messages */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Verifying Your Payment
              </h2>
              <p className="text-gray-600">
                Please wait while we confirm your transaction...
              </p>
            </div>

            {/* Progress Visualization */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full animate-progress" />
            </div>

            {/* Success State (Briefly shown before redirect) */}
            <div className="flex flex-col items-center space-y-2 text-green-600">
              <CheckCircle className="h-12 w-12 animate-bounce" />
              <span className="font-medium">Payment Verified!</span>
            </div>
          </div>

          {/* Action Button (Will appear after verification) */}
          <button 
            onClick={() => navigate("/profile?tab=orders")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            View Your Orders
          </button>
        </div>

        {/* Footer Note */}
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-500">
            This may take a few seconds. Please don't close this window.
          </p>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default PaymentSuccess