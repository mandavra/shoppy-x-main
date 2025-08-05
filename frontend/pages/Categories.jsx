import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Category from "../components/Category";
import getAllCategoriesService from "../services/categories/getAllCategoriesService.js";
import Loader from "../components/Loader.jsx";
import scrollToPageTop from "../utils/scrollToPageTop.js";
import { Helmet } from "react-helmet-async";

// const categories = [
//   {
//     id: 1,
//     name: "Women's Fashion",
//     image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
//     itemCount: 245,
//     href: '/categories/womens-fashion'
//   },
//   {
//     id: 2,
//     name: "Men's Fashion",
//     image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80',
//     itemCount: 186,
//     href: '/categories/mens-fashion'
//   },
//   {
//     id: 3,
//     name: 'Electronics',
//     image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
//     itemCount: 324,
//     href: '/categories/electronics'
//   },
//   {
//     id: 4,
//     name: 'Home & Kitchen',
//     image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
//     itemCount: 157,
//     href: '/categories/home-kitchen'
//   },
//   {
//     id: 5,
//     name: 'Beauty & Health',
//     image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
//     itemCount: 198,
//     href: '/categories/beauty-health'
//   },
//   {
//     id: 6,
//     name: 'Sports & Outdoors',
//     image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
//     itemCount: 145,
//     href: '/categories/sports-outdoors'
//   },
//   {
//     id: 7,
//     name: 'Kids & Baby',
//     image: 'https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
//     itemCount: 167,
//     href: '/categories/kids-baby'
//   },
//   {
//     id: 8,
//     name: 'Jewelry & Watches',
//     image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
//     itemCount: 92,
//     href: '/categories/jewelry-watches'
//   },
//   {
//     id: 9,
//     name: 'Books & Stationery',
//     image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
//     itemCount: 134,
//     href: '/categories/books-stationery'
//   }
// ];

const Categories = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchAllCategories() {
    setIsLoading(true);
    const { data } = await getAllCategoriesService();
    // console.log(data);
    setIsLoading(false);
    setAllCategories(data);
    scrollToPageTop();
  }

  useEffect(() => {
    fetchAllCategories();
  }, []);
  return (
    <>
      <Helmet>
        {/* Title */}
        <title>
          Shop by Categories | Fashion, Electronics & More | ShoppyX
        </title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Explore top product categories including electronics, fashion, home essentials, beauty, and more. Shop trending items and exclusive deals at ShoppyX today!"
        />

        {/* Keywords */}
        <meta
          name="keywords"
          content="ShoppyX, online shopping, product categories, electronics, fashion, home decor, kitchen, beauty, deals, discounts, trending items"
        />

        {/* Open Graph for social sharing */}
        <meta property="og:title" content="Shop by Categories | ShoppyX" />
        <meta
          property="og:description"
          content="Discover a wide range of shopping categories at ShoppyX — from gadgets to fashion, home, and beauty products. Start shopping now!"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://shoppy-x.vercel.app/categories"
        />
        <meta
          property="og:image"
          content="https://shoppy-x.vercel.app/og-default.jpg"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://shoppy-x.vercel.app/categories" />
      </Helmet>
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="sm:text-3xl text-xl font-bold text-gray-900 mb-8">
          Shop by Category
        </h1>
        {isLoading ? (
          <Loader></Loader>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCategories?.map((category) => (
              <Category key={category._id} category={category}></Category>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Categories;
