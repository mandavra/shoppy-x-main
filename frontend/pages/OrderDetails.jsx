import React, { useEffect, useState } from 'react';
import { useParams, Link} from 'react-router-dom';
import { Package, Truck, ArrowLeft, MapPin, Clock, TicketCheck } from 'lucide-react';
import getOrdersByOrderIdService from '../services/orders/getOrdersByOrderIdService.js';
import Loader from "../components/Loader.jsx"
import ErrorPage from './ErrorPage.jsx';
import scrollToPageTop from '../utils/scrollToPageTop.js';
const OrderDetails = () => {
  const { orderId } = useParams();
  const [order,setOrder]=useState(null)
  const [isLoading,setIsLoading]=useState(false)
  const [doesOrderExist,setDoesOrderExist]=useState(true)
  const [userDetails,setUserDetails]=useState(null)

   
  async function fetchOrderDetails(){
    setIsLoading(true)
    const {data} = await getOrdersByOrderIdService(orderId)
    // console.log(data)
    if(data.status==="failed")
      setDoesOrderExist(false)
    setOrder(data.order)
    setUserDetails(data.user)
    setIsLoading(false)
  }
  useEffect(()=>{
    fetchOrderDetails()
    scrollToPageTop()
  },[])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {
        isLoading?<Loader></Loader>:
        !doesOrderExist?<ErrorPage customErrorMessage=" Order doesn't exist"></ErrorPage>:
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/profile?tab=orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Orders
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Order: {order?.orderId}
            </h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                order?.orderStatus === 'Delivered'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {order?.orderStatus.toLowerCase()
                          .split(" ")
                          .map(word=> word.charAt(0).toUpperCase()+word.slice(1)).join(" ")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Items */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="divide-y divide-gray-200">
                  {order?.products?.map((item) => (
                    <div key={item.productId} className="py-6 flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-24 rounded-lg object-cover"
                      />
                      <div className="ml-6 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                        ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{order?.totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">₹0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium">₹{order?.totalPrice-order?.finalPrice}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      {/* <span>₹{(order.total + order.shipping + order.tax).toFixed(2)}</span> */}
                      <span>₹{order?.finalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Order Timeline</h2>
              <div className="space-y-8">
                {order?.orderStatusTimeline.map((event, index) => (
                  <div key={index} className="relative">
                    {index !== order.orderStatusTimeline.length - 1 && (
                      <div className="absolute top-6 left-4 -bottom-10 w-0.5 bg-gray-200" />
                    )}
                    <div className="relative flex items-start">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full 
                    ${!event.status?"bg-blue-100 text-blue-600":"bg-green-100 text-green-600"} `}>
                        {!event.status  ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <TicketCheck className="h-4  w-4" />
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {event.title}
                        </h3>
                        {
                          event.status && 
                          <>
                            <p className="mt-1 text-sm text-gray-500">
                              {event.description}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {event.date?new Date(event.date).toLocaleString("en-IN"):""}
                            </p>
                          </>
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="lg:col-span-1">
            {
              userDetails && 
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    Delivery Address
                  </div>
                  <div className="text-gray-900">
                    <p className="font-medium">{userDetails.name}</p>
                    <p className="font-normal">{userDetails.contactNo}</p>
                    <p>{userDetails.address.area}</p>
                    <p>
                      {userDetails.address.city}, {userDetails.address.state} {userDetails.address.postalCode}
                    </p>
                    <p>{userDetails.address.country}</p>
                  </div>
                </div>
                {/* <div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping Method
                  </div>
                  <p className="text-gray-900">Standard Shipping</p>
                </div> */}
              </div>
            </div>
            }
          </div>
        </div>
      </div>
      }
    </div>
  );
};

export default OrderDetails;