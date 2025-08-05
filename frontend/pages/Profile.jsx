import React, { useEffect, useState } from 'react';
import { User, Package, Heart, CreditCard, Settings, LogOut, Camera, Upload } from 'lucide-react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";
import getMyDetails from '../services/users/getMyDetails.js';
import logout from '../services/users/logout.js';
import checkLogin from '../services/users/checkLogin.js';
import updateMyDetails from '../services/users/updateMyDetails.js';
import uploadMyPhoto from '../services/users/uploadMyPhoto.js';
import updateMyPassword from '../services/users/updateMyPassword.js';
import deleteMyPhoto from '../services/users/deleteMyPhoto.js';
import { Helmet } from 'react-helmet-async';
import getUserOrdersService from '../services/orders/getUserOrdersService.js';
import Loader from '../components/Loader.jsx';

const tabs = [
  { name: 'Personal Info', paramValue:"me", icon: User },
  { name: 'Orders', paramValue:"orders",icon: Package }
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [userOrders,setUserOrders] = useState([])
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile,setSelectedFile]=useState(null)
  const [isLoggedIn,setIsLoggedIn]=useState(true)
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userPhoto,setUserPhoto]=useState("")
  const [isUploading, setIsUploading]=useState(false)
  const [hasAnythingChanged,setHasAnythingChanged]=useState(false)
  const [isImageUploading,setIsImageUploading]=useState(false)
  const [isSaving,setIsSaving]=useState(false)
  const [isLoading,setIsLoading]=useState(false)
  const [isDeleting,setIsDeleting]=useState(false)
  const [isIncorrectPassword,setIsIncorrectPassword]=useState(false)
  const [hasSamePassword,setHasSamePassword]=useState(true)
  const [user,setUser]=useState(null)
  const [userBasicDetails,setUserBasicDetails]=useState({
    name:"",
    email:"",
    contactNo:""
  })
  let basicDetails,addressDetails
  const [userAddress,setUserAddress]=useState({
    area:"",
    city:"",
    country:"",
    postalCode:"",
    state:""
  })
  const navigate = useNavigate()
  const [searchParams,setSearchParams]=useSearchParams()

  function restrictProfileTab(){
    const profileTab = searchParams.get("tab")
    // console.log(profileTab)
    if(profileTab!=="orders" && profileTab!=="me")
      setSearchParams({tab:"me"})
  }
  //helper function for this page
  function successToast(message){
    toast.success(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      });
  }
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setSelectedFile(file)
    }
  };
  const handleDrop = (event) => {
    event.preventDefault(); // Prevents browser from opening the file
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };
  const handleDragOver = (event) => {
    event.preventDefault(); // Allows dropping
  };

  //form and update releated function
  async function checkIsLoggedIn() {
    const data = await checkLogin()
    if(data.status==="success")
      setIsLoggedIn(true)
    else if(data.status==="failed")
      navigate("/userAuth")
  }
  async function userLogout() {
    const data = await logout()
    // console.log(data.data.status)
    if(data.data.status==="success")
      navigate("/userAuth")
  }
  function handleUserLogout(){
    userLogout()
  }

  function handleAddressInputChange(e){
    const {name,value}= e.target
    setUserAddress((previousAddress)=>({
      ...previousAddress,
      [name]:value
    }))
    setHasAnythingChanged(true)
  }
  function handleDetailsInputChange(e){
    const {name,value}= e.target
    setUserBasicDetails((previousDetails)=>({
      ...previousDetails,
      [name]:value
    }))
    setHasAnythingChanged(true)
  }
  async function updateUserDetails(){
    setIsSaving(true)
    const formData= new FormData()
    formData.append("name",userBasicDetails.name)
    formData.append("email",userBasicDetails.email)
    formData.append("contactNo",userBasicDetails.contactNo)
    formData.append("area",userAddress.area)
    formData.append("city",userAddress.city)
    formData.append("state",userAddress.state)
    formData.append("country",userAddress.country)
    formData.append("postalCode",userAddress.postalCode)
    const data = await updateMyDetails(formData)
    // console.log(data)
    fetchUserDetails()
    successToast('Details updated successfully!')
    setIsSaving(false)
    setHasAnythingChanged(false)
  }
  function handleSubmitDetails(){
    updateUserDetails()
  }
  async function handlePasswordUpdate(){
    setIsIncorrectPassword(false)
    setHasSamePassword(true)
    setIsSaving(true)
    const formData = new FormData()
    formData.append("currentPassword",currentPassword)
    formData.append("newPassword",newPassword)
    formData.append("confirmPassword",confirmPassword)
    const data = await updateMyPassword(formData)
    // console.log(data.data)
    
    if(data.status==="failed" && data.message==="Incorrect Password")
      setIsIncorrectPassword(true)
    else if(data.status==="failed" && data.message==="Password should be same as confirm password")
      setHasSamePassword(false)
    else if(data.data.status==="success"){
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setShowPassword(false)
      successToast("Password Updated Successfully")
    }
    
    setIsSaving(false)
  }
  async function handleSubmitPhoto(){
    const formData = new FormData()
    formData.append("image",selectedFile)
    setIsUploading(true)
    const data = await uploadMyPhoto(formData)
    // console.log(data)
    setIsUploading(false)
    setShowPhotoModal(false)
    successToast("Profile photo updated successfully")
    setSelectedFile(null)
    setSelectedImage(null)
    fetchUserDetails()
  }
  async function handleDeletePhoto(){
    if(user.profileImage.public_id.split("/")[2]==="default_profile_image")
      return
    setIsDeleting(true)
    const data = await deleteMyPhoto()
    if(data.data.status==="success"){
      setIsDeleting(false)
      successToast("Profile Photo Deleted")
      fetchUserDetails()

    }

  }
  
  async function fetchUserDetails(){
    try {
      setIsLoading(true)
      const userdetails= await getMyDetails()
      // console.log(userdetails.data)
      setUser(userdetails.data)
      // console.log(userdetails.data.profileImage.public_id.split("/")[2])
      setUserAddress({
        area:userdetails.data.address.area || "",
        city:userdetails.data.address.city || "",
        country:userdetails.data.address.country || "",
        postalCode:userdetails.data.address.postalCode || "",
        state:userdetails.data.address.state || "",

      })
      setUserBasicDetails({
        name: userdetails.data.name || "",
        email: userdetails.data.email || "",
        contactNo: userdetails.data.contactNo || ""
      })
      setIsLoading(false)
    } catch (err) {
      throw new Error(err)
    }
  }
  async function fetchUserOrders(){
    try {
      setIsLoading(true)
      const {data}= await getUserOrdersService()
      // console.log(data)
      setUserOrders(data)
      setIsLoading(false)
      // console.log(userdetails.data.profileImage.public_id.split("/")[2])
      
    } catch (err) {
      throw new Error(err)
    }
  }
  
  

  //for fetching user deails
  useEffect(()=>{
    window.scrollTo(0,0)
    checkIsLoggedIn()
    restrictProfileTab()
    fetchUserDetails()
    fetchUserOrders()
  },[])

  return (
    <>
    <Helmet>
  {/* Title */}
  <title>Your Account & Profile | ShoppyX</title>

  {/* Meta Description */}
  <meta
    name="description"
    content="Manage your account details, orders, and preferences on ShoppyX. Update personal info, view purchase history, and explore personalized recommendations."
  />

  {/* Keywords */}
  <meta
    name="keywords"
    content="ShoppyX user profile, account settings, purchase history, profile page, manage account, online shopping dashboard"
  />

  {/* Open Graph */}
  <meta property="og:title" content="Your Profile | ShoppyX" />
  <meta
    property="og:description"
    content="Access and manage your ShoppyX profile. Edit details, track orders, and enjoy a personalized shopping experience."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://shoppy-x.vercel.app/profile" />
  <meta
    property="og:image"
    content="https://shoppy-x.vercel.app/og-default.jpg"
  />

  {/* Canonical URL */}
  <link rel="canonical" href="https://shoppy-x.vercel.app/profile" />
</Helmet>

    {
    
    <div className="max-w-7xl min-h-[90vh] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col mb-6">
              <div className="relative group mb-4">
                <img
                  src={user?.profileImage.url}
                  alt={user?.name}
                  className="h-16 w-16 rounded-full"
                  />                
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setSearchParams({tab:tab.paramValue})}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                      searchParams.get("tab") === tab.paramValue
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
              <button onClick={handleUserLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {
            isLoading?<Loader></Loader>:
          <div className="bg-white rounded-xl shadow-sm p-6">
            {searchParams.get("tab") === 'me' && (
              <>
              <div>
                <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
                
                {/* Profile Photo Section */}
                <div className="mb-8 p-6 border border-gray-200 rounded-lg">
                  <h4 className="text-lg font-medium mb-4">Profile Photo</h4>
                  <div className="flex items-start space-x-6">
                    <img
                      src={user?.profileImage.url}
                      alt={user?.name}
                      className="h-24 w-24 rounded-full"
                    />
                    <div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => setShowPhotoModal(true)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          Change Photo
                        </button>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50"
                        onClick={handleDeletePhoto}>
                          {
                            isDeleting?"Removing...":"Remove"
                        }
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        JPG, JPEG or PNG. Max size of 2MB.
                      </p>
                    </div>
                  </div>
                </div>

              {/* basic details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      onChange={handleDetailsInputChange}
                      value={userBasicDetails.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userBasicDetails.email}
                      onChange={handleDetailsInputChange}
                      disabled={true}
                      className="w-full px-4 py-2 border bg-slate-200 text-slate-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="number"
                      name="contactNo"
                      value={userBasicDetails.contactNo}
                      onChange={handleDetailsInputChange}
                      
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

              {/* address */}
                <h3 className="text-xl font-semibold mt-8 mb-6">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Local Area
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={userAddress.area}
                      onChange={handleAddressInputChange}
                      
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={userAddress.city}
                      onChange={handleAddressInputChange}
                      
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={userAddress.state}
                      onChange={handleAddressInputChange}
                      
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={userAddress.postalCode}
                      onChange={handleAddressInputChange}
                      
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={userAddress.country}
                      onChange={handleAddressInputChange}
                      
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button className={`${hasAnythingChanged?"bg-blue-600 hover:bg-blue-700 text-white ":"bg-slate-400 text-slate-200"} px-6 py-2 rounded-lg `}
                  disabled={isSaving||!hasAnythingChanged}
                  onClick={handleSubmitDetails}>
                    {
                      isSaving? "Saving...":"Save Changes"
                    }
                  </button>
                </div>
              </div>
              <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-6">Update Password</h3>
              <div className="space-y-4">
                {[
                  { label: "Current Password", state: currentPassword, setState: setCurrentPassword },
                  { label: "New Password", state: newPassword, setState: setNewPassword },
                  { label: "Confirm Password", state: confirmPassword, setState: setConfirmPassword },
                ].map(({ label, state, setState }, index) => (
                  <div key={index} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={state}
                      required={true}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                ))}
              {(!currentPassword || !newPassword || !confirmPassword) && <p className='text-red-500'>All fields are required</p>}
                {isIncorrectPassword&& <p className='text-red-500'>Wrong Password</p>}
                {!hasSamePassword&& <p className='text-red-500'>New and Confirm Password should be same</p>}
             </div>
              <div className="mt-6">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full"
                onClick={handlePasswordUpdate}
                disabled={(!currentPassword || !newPassword || !confirmPassword)||isSaving}>
                  {
                    isSaving?"Updating...":"Update Password"
                  }
                </button>
              </div>
            </div>
              </>
            )}

            {searchParams.get("tab") === 'orders' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Order History</h3>
                {
                  userOrders.length===0?<div className="text-center py-10 px-4 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
                  <div className="flex justify-center mb-4">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Yet</h3>
                  <p className="text-sm text-gray-500">You haven't placed any orders. When you do, they'll show up here!</p>
                  <Link
                    to="/"
                    className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-full text-sm hover:bg-blue-700 transition-all duration-200"
                  >
                    Start Shopping
                  </Link>
                </div>:
                <div className="space-y-4">
                  {userOrders?.map((order) => (
                    <div
                      key={order.orderId}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{order.orderId}</span>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.orderStatus.toLowerCase()
                          .split(" ")
                          .map(word=> word.charAt(0).toUpperCase()+word.slice(1)).join(" ")}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Items: {order.products.length}</p>
                        <p>Total: ₹{order.finalPrice}</p>
                      </div>
                      <Link
                        to={`/order/${order.orderId}`}
                        className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                      >
                        View Details
                        <Package className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  ))}
                </div>
                }
              </div>
            )}
          </div>
          }
        </div>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-semibold mb-4">Update Profile Photo</h3>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center relative">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              id="photo-upload"
              onChange={handleImageChange}
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-24 h-24 rounded-full object-cover mb-3"
                />
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  <span className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    JPG, GIF or PNG. Max size of 2MB
                  </span>
                </>
              )}
            </label>
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={() => setShowPhotoModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
             disabled={isUploading}
             onClick={handleSubmitPhoto}>
              {
                isUploading?"Uploading...":"Upload Photo"
              } 
            </button>
          </div>
        </div>
      </div>
      )}
    </div>

    }
    </>
  );
};

export default Profile;