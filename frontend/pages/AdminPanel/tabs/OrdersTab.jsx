import React, { useEffect, useState } from 'react';
import { Search, Edit2, RefreshCw } from 'lucide-react';
import Modal from '../common/Modal';
import OrderRow from './adminComponents/OrderRow';
import getAllOrdersService from '../../../services/orders/getAllOrdersService.js';
import getOrdersByOrderIdService from '../../../services/orders/getOrdersByOrderIdService.js';
import getStatusDate from '../../../utils/getStatusDate.js';
import getSearchedOrderService from '../../../services/orders/getSearchedOrderService.js';
import Loader from '../../../components/Loader.jsx';
import SmallLoader from '../../../components/SmallLoader.jsx';
import updateOrderService from '../../../services/orders/updateOrderService.js';
import { useSearchParams } from 'react-router-dom';
import getOrdersByPage from '../../../services/orders/getOrdersByPage.js';


const statusOptions = ["Order Placed", "Shipped", "In Transit","Out for Delivery","Delivered"];

function OrdersTab() {
  const [orders,setOrders] = useState([]);
  const [searchQueryId, setSearchQueryId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [doesOrderExist, setDoesOrderExist] = useState(false);
  const [isOrderSearching, setIsOrderSearching] = useState(false);


  async function handleSearch(){
    // console.log(searchQueryId)
    setSearchResult(null)
    setIsOrderSearching(true)
    const {data} = await getSearchedOrderService(searchQueryId.toUpperCase())
    // console.log(data)
    if(data.status==="failed"){
      setIsOrderSearching(false)
      setDoesOrderExist(false)
      setSearchResult(null)
      return
    }
    setIsOrderSearching(false)
    setDoesOrderExist(true)
    setSearchResult(data.data)
  };

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setEditStatus(order.orderStatus);
    setShowEditModal(true);
  };

  async function handleStatusUpdate () {
    setIsUpdating(true);
    // Simulate API call
    // console.log(selectedOrder)
    // console.log(editStatus)
    const formData = new FormData()
    formData.append("orderStatus",editStatus)
    const data = await updateOrderService(selectedOrder.orderId,formData)
    // console.log(data)
    fetchAllOrders()
    setIsUpdating(false);
    setShowEditModal(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'order placed': 
        return 'bg-amber-100 text-amber-700'; // warm yellow-orange
      case 'shipped': 
        return 'bg-violet-100 text-violet-700'; // bold and clean
      case 'in transit': 
        return 'bg-indigo-100 text-indigo-700'; // deep and stable
      case 'out for delivery': 
        return 'bg-cyan-100 text-cyan-700'; // bright and fresh
      case 'delivered': 
        return 'bg-emerald-100 text-emerald-700'; // successful and happy
      default: 
        return 'bg-gray-100 text-gray-700'; // fallback neutral
    }
  };

  const [searchParams,setSearchParams]=useSearchParams()
  
  function restrictOrdersTab(){
    const page = searchParams.get("page")
    if(!page || page<1) {
      setSearchParams({page:1})
      return
    }
  }
  async function fetchAllOrders(){
    const page = searchParams.get("page")
    setCurrentPage(Number(page))
    setIsLoading(true)
    const data = await getOrdersByPage(page)
    // console.log(data)
    setOrders(data.data)
    setTotalPages(data.totalPages)
    setIsLoading(false)
  }

  useEffect(()=>{
    restrictOrdersTab()
    // fetchAllOrders()
  },[])
  useEffect(()=>{
    fetchAllOrders()
  },[searchParams])

  

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Section */}
      <div className="bg-white rounded-2xl  shadow-md p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Search Order</h2>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter Order ID..."
              value={searchQueryId}
              onChange={(e) => setSearchQueryId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Search
          </button>
        </div>
        {
          isOrderSearching ? <SmallLoader customMessage="Searching..."/>:searchResult ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <OrderRow order={searchResult} handleEditClick={handleEditClick} getStatusColor={getStatusColor} />
              </tbody>
            </table>
          </div>
        ):<p className="mt-4 text-sm text-gray-500">Please enter a valid order ID</p>
        }
        
       
      </div>

      {/* All Orders Section */}
      
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">All Orders</h2>
        
        {
          isLoading?<SmallLoader customMessage="Loading..."/>:
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <OrderRow key={order._id} order={order} getStatusColor={getStatusColor} handleEditClick={handleEditClick} />
                  ))}
                </tbody>
              </table>
            </div>
          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSearchParams({page:currentPage-1})}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setSearchParams({page:i+1})}
                  className={`px-3 py-2 border rounded-lg ${
                    currentPage === i + 1
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50 text-black"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setSearchParams({page:currentPage+1})}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
          </>
        }

      </div>

      {/* Edit Status Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Update Order Status"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Order ID</p>
                <p className="mt-1 text-sm text-gray-900">{selectedOrder?.orderId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Customer</p>
                <p className="mt-1 text-sm text-gray-900">{selectedOrder?.user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Price</p>
                <p className="mt-1 text-sm text-gray-900">₹{selectedOrder?.finalPrice}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="mt-1 text-sm text-gray-900">{selectedOrder && getStatusDate(selectedOrder)}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={isUpdating}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-75"
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default OrdersTab;