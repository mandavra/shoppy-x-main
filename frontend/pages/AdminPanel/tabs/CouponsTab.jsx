import { useEffect, useState } from "react";
import { Plus, X, Trash2, Tag, AlertTriangle, BadgePercent } from "lucide-react";
import getAllCouponsService from "../../../services/coupons/getAllCouponsService";
import createCouponService from "../../../services/coupons/createCouponService";
import successToastMessage from "../../../utils/successToastMessage";
import deleteCouponService from "../../../services/coupons/deleteCouponService";
import SmallLoader from "../../../components/SmallLoader";

const CouponsTab = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponIdToDelete, setCouponIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const [newCoupon, setNewCoupon] = useState({ title: "", discountPrice: "" });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewCoupon((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  async function handleAddCoupon(e) {
    e.preventDefault();
    setIsAdding(true);
    setIsError(false);
    const formData = new FormData();
    formData.append("title", newCoupon.title);
    formData.append("discountPrice", newCoupon.discountPrice);
    const data = await createCouponService(formData);
    if (data.status === "error") {
      setIsError(true);
      setIsAdding(false);
      return;
    }

    // console.log(data);
    setNewCoupon({ title: "", discountPrice: "" });
    setShowModal(false);
    setIsAdding(false);
    fetchAllCoupons();
    successToastMessage("Coupon Added Successfully!");
  }

  async function handleCouponDelete() {
    setIsDeleting(true);
    const data = await deleteCouponService(couponIdToDelete);
    // console.log(data);
    setCouponIdToDelete(null);
    setIsDeleting(false);
    setShowDeleteModal(false);
    fetchAllCoupons();
    successToastMessage("Coupon deleted successfully");
  }
  async function fetchAllCoupons() {
    setIsLoading(true)
    const data = await getAllCouponsService();
    // console.log(data);
    setCoupons(data.data);
    setIsLoading(false)
  }

  useEffect(() => {
    fetchAllCoupons();
  }, []);

  return (
    <div className="px-4 sm:px-0">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add
        </button>
      </div>
      {
        isLoading?<SmallLoader></SmallLoader>:
        coupons.length===0?<div className="flex flex-col items-center justify-center py-10 text-center bg-blue-50 rounded-xl shadow-inner border border-blue-200">
        <BadgePercent className="text-blue-500"/>
        <h2 className="text-xl font-semibold text-blue-600">
          No Coupons Yet
        </h2>
        <p className="text-gray-500 mt-1">
          Start adding coupons to offer discounts to your customers.
        </p>
      </div>:<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon._id}
            className="relative group bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg p-5 transition-all duration-300 hover:scale-105 border-t-4 border-blue-500"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {coupon.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(true);
                  setCouponIdToDelete(coupon._id);
                }}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-3 text-md text-red-400  font-medium">
              -₹{coupon.discountPrice}
            </p>
          </div>
        ))}
      </div>
      }

      
      {/* Coupon Cards */}
      

      {/* Add Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 p-2 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg">
            <X
              className="absolute top-3 right-3 w-5 h-5 cursor-pointer text-gray-600 hover:text-red-500"
              onClick={() => setShowModal(false)}
            />
            <h2 className="text-xl font-bold mb-4">Add New Coupon</h2>
            <form onSubmit={handleAddCoupon} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Name
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={newCoupon.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter coupon name"
                />
              </div>
              {isError && (
                <p className="text-red-500 text-sm">
                  Cupon Name already exists
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  required
                  value={newCoupon.discountPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter discount price"
                />
              </div>
              <button
                type="submit"
                disabled={isAdding}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {isAdding ? "Adding..." : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 p-2 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Confirm Delete
            </h3>
            <div className="flex items-start p-4 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="w-6 h-6 mr-3 mt-1" />
              <p>
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCouponIdToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCouponDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsTab;
