import React, { useEffect, useRef, useState } from 'react';
import { Timer, ShoppingBag, Gift, TrendingUp} from 'lucide-react';
import { Link } from 'react-router-dom';
import Offer from '../components/Offer';
import { Helmet } from 'react-helmet-async';
import getAllOffersService from "../services/offers/getAllOffersService.js"
import scrollToPageTop from "../utils/scrollToPageTop.js"
import Loader from "../components/Loader.jsx"
// const offers = [
//   {
//     id: 1,
//     title: 'Summer Collection',
//     description: 'Get up to 30% off on all summer essentials',
//     image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
//     discount: '30%',
//     validUntil: 'August 31, 2024',
//     category: 'Summer Fashion',
//     href: '/categories/summer-fashion'
//   },
//   {
//     id: 2,
//     title: 'Winter Clearance',
//     description: 'Massive discounts on winter wear and accessories',
//     image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
//     discount: '20%',
//     validUntil: 'July 15, 2024',
//     category: 'Winter Collection',
//     href: '/categories/winter-collection'
//   },
//   {
//     id: 3,
//     title: 'Electronics Week',
//     description: 'Special deals on latest gadgets and electronics',
//     image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
//     discount: '25%',
//     validUntil: 'July 20, 2024',
//     category: 'Electronics',
//     href: '/categories/electronics'
//   },
//   {
//     id: 4,
//     title: 'Home Makeover Sale',
//     description: 'Transform your space with amazing discounts on home decor',
//     image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
//     discount: '15%',
//     validUntil: 'July 25, 2024',
//     category: 'Home & Living',
//     href: '/categories/home-living'
//   }
// ];

const OffersPage = () => {

  const [offers,setOffers]=useState()
  const [isLoading,setisLoading]=useState(false)

  async function fetchAllOffers(){
    setisLoading(true)
    const data = await getAllOffersService()
    // console.log("Offer",data)
    setOffers(data.data)
    setisLoading(false)
  }

  useEffect(()=>{
    scrollToPageTop()
    fetchAllOffers()
  },[])
  return (
    <>
    <Helmet>
  {/* Title */}
  <title>Best Online Deals & Offers | ShoppyX</title>

  {/* Meta Description */}
  <meta
    name="description"
    content="Grab the best online shopping deals and offers at ShoppyX. Limited-time discounts on electronics, fashion, home, and more. Shop and save today!"
  />

  {/* Keywords */}
  <meta
    name="keywords"
    content="ShoppyX offers, online deals, shopping discounts, electronics sale, fashion deals, home essentials offer, limited-time deals"
  />

  {/* Open Graph */}
  <meta property="og:title" content="Exciting Shopping Offers | ShoppyX" />
  <meta
    property="og:description"
    content="Save big with exclusive shopping offers at ShoppyX. Find amazing discounts on your favorite products — hurry, limited time only!"
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://shoppy-x.vercel.app/offers" />
  <meta
    property="og:image"
    content="https://shoppy-x.vercel.app/og-default.jpg"
  />

  {/* Canonical URL */}
  <link rel="canonical" href="https://shoppy-x.vercel.app/offers" />
</Helmet>

    <div  className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-600 text-white py-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Sale Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Exclusive Offers & Deals</h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
            Discover amazing discounts and special promotions across all categories
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
            <Timer className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Limited Time Offers</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
            <ShoppingBag className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">1000+</div>
            <div className="text-sm text-gray-600">Products on Sale</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
            <Gift className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">30%</div>
            <div className="text-sm text-gray-600">Maximum Discount</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
            <TrendingUp className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">50K+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      {
        isLoading?<Loader></Loader>:
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {
          offers?.map((offer) => (
            <Offer key={offer._id} offer={offer}></Offer>
          ))
          }
        </div>
      </div>
      }

      {/* Newsletter Section */}
      {/* <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with Latest Offers
            </h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss out on exclusive deals and promotions
            </p>
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div> */}
    </div>
    </>
  );
};

export default OffersPage;