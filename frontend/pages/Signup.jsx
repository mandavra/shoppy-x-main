import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import checkLogin from '../services/users/checkLogin';
import signUp from '../services/users/signUp.js';
import { Helmet } from 'react-helmet-async';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    area: '',
    city: '',
    state: '',
    country: '',
    pin: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailDuplicate,setIsEmailDuplicate]=useState(false)
  const [doesPasswordMatch,setDoesPasswordMatch] = useState(true)
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate()
  async function checkIsLoggedIn() {
      const data = await checkLogin()
      if(data.data.status==="success")
        navigate("/profile")
    }
  useEffect(() => {
    window.scrollTo(0, 0);
    checkIsLoggedIn()
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  async function sendFormSignUp(){
    
    setIsEmailDuplicate(false)
    const signUpFormData = new FormData()
    signUpFormData.append("name",formData.name)
    signUpFormData.append("email",formData.email)
    signUpFormData.append("contactNo",formData.phone)
    signUpFormData.append("password",formData.password)
    signUpFormData.append("confirmPassword",formData.confirmPassword)
    signUpFormData.append("area",formData.area)
    signUpFormData.append("city",formData.city)
    signUpFormData.append("state",formData.state)
    signUpFormData.append("country",formData.country)
    signUpFormData.append("postalCode",formData.pin)
    const data = await signUp(signUpFormData)
    // console.log("got it",data.data.status)
    
    if(data.status==="error")
      setIsEmailDuplicate(true)
    else if(data.data.status==="success")
      navigate("/profile")

  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.password!==formData.confirmPassword){
      setDoesPasswordMatch(false)
      return
    }
    setDoesPasswordMatch(true)
    sendFormSignUp()
    // console.log(formData);
  };

  return (
    <>
    <Helmet>
  {/* Title */}
  <title>Create Your Account | Join ShoppyX Today</title>

  {/* Meta Description */}
  <meta
    name="description"
    content="Sign up for a ShoppyX account and unlock exclusive shopping deals, personalized recommendations, and faster checkouts. Join now!"
  />

  {/* Keywords */}
  <meta
    name="keywords"
    content="ShoppyX sign up, create account, register ShoppyX, join ShoppyX, new user registration, online shopping account"
  />

  {/* Open Graph */}
  <meta property="og:title" content="Sign Up | ShoppyX" />
  <meta
    property="og:description"
    content="Create your ShoppyX account to explore personalized shopping, track orders, and receive exclusive member offers."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://shoppy-x.vercel.app/signup" />
  <meta
    property="og:image"
    content="https://shoppy-x.vercel.app/og-default.jpg"
  />

  {/* Canonical URL */}
  <link rel="canonical" href="https://shoppy-x.vercel.app/signup" />
</Helmet>

    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-roboto font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us today and enjoy a seamless shopping experience
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your email address"
                  />
                </div>{
                  isEmailDuplicate &&<p className='text-red-600'>Account with this mail already exists</p>
                }
                </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Contact No."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {
                  !doesPasswordMatch && <p className='text-red-600 ml-1 '>Passwords do not match</p>
              
                }
                </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                    Local Area
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="area"
                      name="area"
                      type="text"
                      required
                      value={formData.area}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Street address, apartment, etc."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your City"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your State"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Country"
                  />
                </div>

                <div>
                  <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
                    PIN Code
                  </label>
                  <input
                    id="pin"
                    name="pin"
                    type="text"
                    required
                    value={formData.pin}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your PIN Code"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={!agreeToTerms}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white ${
                  agreeToTerms ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Signup;