import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import login from '../services/users/login.js';
import checkLogin from '../services/users/checkLogin.js';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isDetailsWrong,setIsDetailsWrong]=useState(false)
  const [isLoggingIn,setIsLoggingIn]=useState(false)
  const navigate = useNavigate()

  async function checkIsLoggedIn() {
    const data = await checkLogin()
    if(data.data.status==="success")
      navigate("/profile")
  }

  async function userLogin(){
    setIsLoggingIn(true)
    const formData = new FormData()
    formData.append("email",email)
    formData.append("password",password)
    formData.append("remember",rememberMe)
    try {
      const data = await login(formData)
      // console.log(data)
      setIsDetailsWrong(false)
      setIsLoggingIn(false)
      navigate("/profile")
    } catch (err) {
      console.log("login failed")
      setIsDetailsWrong(true)
      setIsLoggingIn(false)
      throw new Error(err)
    }
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    checkIsLoggedIn()
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    userLogin()
  };

  return (
    <>
    <Helmet>
  {/* Title */}
  <title>Login to Your Account | ShoppyX</title>

  {/* Meta Description */}
  <meta
    name="description"
    content="Access your ShoppyX account to manage orders, track deliveries, and explore exclusive deals. Secure and fast login experience."
  />

  {/* Keywords */}
  <meta
    name="keywords"
    content="ShoppyX login, account login, sign in ShoppyX, user account, track orders, online shopping login"
  />

  {/* Open Graph */}
  <meta property="og:title" content="Login | ShoppyX" />
  <meta
    property="og:description"
    content="Login to your ShoppyX account to enjoy a personalized shopping experience. Safe and secure access to your orders and wishlist."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://shoppy-x.vercel.app/login" />
  <meta
    property="og:image"
    content="https://shoppy-x.vercel.app/og-default.jpg"
  />

  {/* Canonical URL */}
  <link rel="canonical" href="https://shoppy-x.vercel.app/login" />
</Helmet>

    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-roboto font-extrabold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {
                  isLoggingIn? "Signing in...":"Sign in"
                }
                
              </button>
            </div>
            {
              isDetailsWrong &&
              <p className='text-center text-red-600'>Incorrect Email or Password</p>
            }
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/signup"
                className="w-full flex justify-center py-3 px-4 border border-blue-600 rounded-lg text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;