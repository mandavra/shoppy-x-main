import {useState, useEffect} from "react"
import { Trash2, X } from "lucide-react";
import checkLogin from "../services/users/checkLogin.js";
import { useNavigate } from "react-router-dom";
import getCartProductsService from "../services/cart/getCartProductsService.js";
import CartProduct from "./CartProduct.jsx";
import updateCartProductService from "../services/cart/updateCartProductService.js";
import deleteCartProductService from "../services/cart/deleteCartProductService.js";
import EmptyCart from "./EmptyCart.jsx";
import getCouponByNameService from "../services/coupons/getCouponsByNameService.js";
import createOrderService from "../services/orders/createOrderService.js";
import successToastMessage from "../utils/successToastMessage.js";
import errorToastMessage from "../utils/errorToastMessage.js";
import createPaymentService, { processPaymentService } from "../services/payment/createPaymentService.js";
import PaymentProcessor from "./PaymentProcessor.jsx";

function Cart({setIsCartOpen}) {
  const [cartProducts,setCartProducts]=useState([])
  const [totalProducts,setTotalProducts]=useState(0)
  const [totalAmount,setTotalAmount]=useState(0)
  const [finalAmount,setFinalAmount]=useState(0)
  const [isLoggedIn,setIsLoggedIn]=useState(false)
  const [coupon, setCoupon] = useState("");
  const [isValidCoupon, setisValidCoupon] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const navigate = useNavigate()

  async function hasLoggedIn() {
    const data = await checkLogin()
    console.log("logged cart",data)
    if(data.status==="failed" && data.message==="Not Logged in"){
      setIsCartOpen(false)
      setIsLoggedIn(false)
      navigate("/userAuth")
    }else if(data.data.status==="success"){
      setIsCartOpen(true)
      setIsLoggedIn(true)
      setCartProducts(data.data.user.cart)
      setTotalAmount(data.data.user.cartAmount)
      setTotalProducts(data.data.user.cart.length)
    }
  }
  async function updateProductQuantity(id,formData){
    const data = await updateCartProductService(id,formData)
    setCartProducts(data.data.cart)
    setTotalAmount(data.data.cartAmount)
    if(finalAmount>0)
      setFinalAmount(data.data.cartAmount-discountPrice)
  }
  async function deleteCartProduct(id){
    const data = await deleteCartProductService(id)
    console.log(data)
    setCartProducts(data.data.cart)
    setTotalProducts(data.data.cart.length)
    setTotalAmount(data.data.cartAmount)
    if(finalAmount>0)
      setFinalAmount(data.data.cartAmount-discountPrice)
  }
  async function fetchAllCartProducts(){
    const {data} = await getCartProductsService()
    console.log(data.cart)
    setCartProducts(data.cart)
    setTotalProducts(data.cart.length)
  }

  async function fetchAndApplyCupon(){
    if(!coupon)
      return
    console.log(coupon)
    setIsApplied(false)
    setisValidCoupon(true)
    const data = await getCouponByNameService(coupon)
    if(data.status==="failed"){
      setisValidCoupon(false)
      return
    }
    setisValidCoupon(true)
    setIsApplied(true)
    console.log(data.data)
    setDiscountPrice(data.data.discountPrice)
    setFinalAmount(totalAmount-data.data.discountPrice)
    
  }
  async function submitOrder(){
    console.log(cartProducts)
    // no need to use form data
    const products = cartProducts.map(product=>({
        productId:product.productId,
        name:product.name,
        image:product.image,
        quantity:product.quantity,
        price:product.quantity*product.price
      }))
    const orderData = {
      products,
      orderStatus:"Order Placed",
      // orderPrice:finalAmount>0?finalAmount:totalAmount
      totalPrice:totalAmount,
      finalPrice:finalAmount>0?finalAmount:totalAmount
    }
    
    // Navigate to payment page with order data
    setIsProcessing(false)
    setIsCartOpen(false)
    navigate("/payment", { 
      state: { 
        orderData: {
          products,
          totalPrice: totalAmount,
          finalPrice: finalAmount > 0 ? finalAmount : totalAmount
        }
      }
    })
  }

  const handlePaymentComplete = async () => {
    try {
      // Process the payment in backend
      const paymentResult = await processPaymentService({
        paymentId: paymentData?.paymentId,
        transactionDetails: {
          method: "card",
          timestamp: new Date().toISOString()
        }
      })
      
      if(paymentResult?.paymentStatus === "completed") {
        successToastMessage("Payment completed successfully!")
        setCartProducts([])
        setIsCartOpen(false)
        setShowPaymentProcessor(false)
      } else {
        errorToastMessage("Payment failed. Please try again.")
        setShowPaymentProcessor(false)
      }
    } catch (error) {
      errorToastMessage("Payment processing error. Please try again.")
      setShowPaymentProcessor(false)
    }
  }

  const handlePaymentFailed = () => {
    errorToastMessage("Payment failed. Please try again.")
    setShowPaymentProcessor(false)
  }
  useEffect(()=>{
    hasLoggedIn()
    console.log("hi")
    fetchAllCartProducts()
  },[])


    return (
      <>
      {
        isLoggedIn &&
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-6 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">Shopping Cart ({totalProducts})</h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-gray-400 bg-transparent hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                {
                  cartProducts.length===0?<EmptyCart></EmptyCart>:
                  <>
              {/* cart with items */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                  <div className="flow-root">
                    <ul className="divide-y divide-gray-200">
                      {cartProducts.map((item) => (
                        <CartProduct key={item._id} item={item} 
                        updateProductQuantity={updateProductQuantity}
                        deleteCartProduct={deleteCartProduct}></CartProduct>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-white shadow-md rounded-b-lg">
      <div className="mb-6">
        <div className="flex flex-wrap items-center">
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 px-4 py-2 border w-20 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={fetchAndApplyCupon}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-r-lg hover:from-blue-700 hover:to-blue-900 transition"
          >
            {isApplied ? "Applied!" : "Apply"}
          </button>
        </div>
        {!isValidCoupon&&(
          <p className="text-red-500 text-sm">
            Please enter a valid coupon code
          </p>
        )}
        {isApplied && (
          <p className="mt-2 text-green-600 text-sm font-medium animate-pulse">
            Coupon applied successfully!
          </p>
        )}
      </div>

      <div className="flex justify-between items-center text-base font-medium text-gray-900 mb-4">
        <p>Subtotal</p>
        <div className="text-right">
          {isApplied ? (
            <>
              <p className="line-through text-gray-400">₹{totalAmount}</p>
              <p className="text-green-600 font-semibold text-lg transition-all duration-300">
                ₹{finalAmount}
              </p>
            </>
          ) : (
            <p className="text-lg font-semibold">₹{totalAmount}</p>
          )}
        </div>
      </div>

      <button
      disabled={isProcessing} onClick={submitOrder} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300">
        {
          isProcessing?"Redirecting to payment...":"Proceed to Checkout"
        }
        
      </button>
    </div>
                  
                  </>
                }

              </div>
            </div>
          </div>
        </div>
        
      }

      {/* Payment Processor Modal */}
      <PaymentProcessor
        isOpen={showPaymentProcessor}
        onClose={() => setShowPaymentProcessor(false)}
        amount={finalAmount > 0 ? finalAmount : totalAmount}
        onPaymentComplete={handlePaymentComplete}
        onPaymentFailed={handlePaymentFailed}
      />
      </>
    )
}

export default Cart
