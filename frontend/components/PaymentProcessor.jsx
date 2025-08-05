import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, CreditCard, Shield, Clock } from "lucide-react";

function PaymentProcessor({ 
  isOpen, 
  onClose, 
  amount, 
  onPaymentComplete, 
  onPaymentFailed 
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("processing"); // processing, success, failed
  const [progress, setProgress] = useState(0);

  const steps = [
    { icon: CreditCard, title: "Initializing Payment", description: "Setting up secure connection..." },
    { icon: Shield, title: "Security Check", description: "Verifying payment details..." },
    { icon: Clock, title: "Processing Payment", description: "Processing your transaction..." },
    { icon: CheckCircle, title: "Payment Complete", description: "Transaction successful!" }
  ];

  useEffect(() => {
    if (!isOpen) return;

    const simulatePayment = async () => {
      // Step 1: Initialize (0-25%)
      setCurrentStep(0);
      for (let i = 0; i <= 25; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setProgress(i);
      }

      // Step 2: Security Check (25-50%)
      setCurrentStep(1);
      for (let i = 25; i <= 50; i++) {
        await new Promise(resolve => setTimeout(resolve, 60));
        setProgress(i);
      }

      // Step 3: Processing (50-90%)
      setCurrentStep(2);
      for (let i = 50; i <= 90; i++) {
        await new Promise(resolve => setTimeout(resolve, 80));
        setProgress(i);
      }

      // Simulate payment result (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        // Step 4: Success (90-100%)
        setCurrentStep(3);
        setPaymentStatus("success");
        for (let i = 90; i <= 100; i++) {
          await new Promise(resolve => setTimeout(resolve, 30));
          setProgress(i);
        }
        
        // Show success for 2 seconds then close
        setTimeout(() => {
          onPaymentComplete();
        }, 2000);
      } else {
        // Payment failed
        setPaymentStatus("failed");
        setTimeout(() => {
          onPaymentFailed();
        }, 2000);
      }
    };

    simulatePayment();
  }, [isOpen, onPaymentComplete, onPaymentFailed]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-75" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <h1 className="text-2xl font-bold text-white text-center">
              Payment Processing
            </h1>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Amount Display */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">Amount to Pay</p>
              <p className="text-3xl font-bold text-gray-900">₹{amount}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Current Step */}
            <div className="flex items-center justify-center space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const isPending = index > currentStep;

                return (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                      ${isCompleted ? 'bg-green-500 text-white' : 
                        isActive ? 'bg-blue-500 text-white animate-pulse' : 
                        'bg-gray-200 text-gray-400'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : isActive ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                      {isActive && (
                        <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status Message */}
            <div className="text-center space-y-2">
              {paymentStatus === "processing" && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {steps[currentStep]?.title}
                  </h2>
                  <p className="text-gray-600">
                    {steps[currentStep]?.description}
                  </p>
                </>
              )}

              {paymentStatus === "success" && (
                <div className="flex flex-col items-center space-y-2 text-green-600">
                  <CheckCircle className="h-16 w-16 animate-bounce" />
                  <h2 className="text-xl font-semibold">Payment Successful!</h2>
                  <p className="text-gray-600">Your order has been confirmed</p>
                </div>
              )}

              {paymentStatus === "failed" && (
                <div className="flex flex-col items-center space-y-2 text-red-600">
                  <XCircle className="h-16 w-16 animate-bounce" />
                  <h2 className="text-xl font-semibold">Payment Failed</h2>
                  <p className="text-gray-600">Please try again</p>
                </div>
              )}
            </div>

            {/* Cancel Button (only during processing) */}
            {paymentStatus === "processing" && (
              <button
                onClick={onClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-all duration-300"
              >
                Cancel Payment
              </button>
            )}
          </div>

          {/* Footer Note */}
          <div className="bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-500">
              {paymentStatus === "processing" 
                ? "Please don't close this window during payment processing."
                : paymentStatus === "success"
                ? "Redirecting to your orders..."
                : "You can try again or contact support."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentProcessor; 