import React, { useState, useEffect } from "react";
import {
  redirect,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Star, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import Product from "../components/Product";
import Loader from "../components/Loader.jsx";
import getProductsByCategoryService from "../services/products/getProductsByCategoryService.js";
import scrollToPageTop from "../utils/scrollToPageTop.js";
import NoProductsFound from "../components/NoProductsFound.jsx";
import getCategoryByValueService from "../services/categories/getCategoryByValueService.js";
import getProductsByQueryService from "../services/products/getProductsByQueryService.js";
import { Helmet } from "react-helmet-async";

const sortOptions = [
  // { name: "Most Popular", value: "popular" },
  { name: "Newest", value: "newest" },
  { name: "Price: Low to High", value: "price_asc" },
  { name: "Price: High to Low", value: "price_desc" },
  // { name: "Rating", value: "rating" },
];

const filters = [
  {
    name: "price",
    options: [
      { value: "0-50", label: "Under ₹50" },
      { value: "50-100", label: "₹50 to ₹100" },
      { value: "100-200", label: "₹100 to ₹200" },
      { value: "200", label: "Over ₹200" },
    ],
  },
  {
    name: "rating",
    options: [
      { value: "4", label: "4 Stars & Up" },
      { value: "3", label: "3 Stars & Up" },
      { value: "2", label: "2 Stars & Up" },
    ],
  },
  {
    name: "discount",
    options: [
      { value: "10", label: "10% Off or More" },
      { value: "20", label: "20% Off or More" },
      { value: "30", label: "30% Off or More" },
    ],
  },
];

const SearchedProducts = () => {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [theCurrentPage, setTheCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    price: null,
    rating: null,
    discount: null,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to check if required params are present, redirects if not
  function restrictParams() {
    const pageParam = searchParams.get("page");
    const queryParam = searchParams.get("query");
    if (!pageParam || !queryParam) {
      navigate(`/`, { replace: true });
      return false;
    }
    return true;
  }

  // Function to get the current page from URL params
  function getCurrentPage() {
    return searchParams.get("page") || "1";
  }

  // Function to fetch products based on URL params
  async function fetchProducts() {
    setIsLoading(true);
    const pageParam = searchParams.get("page");
    const queryParam = searchParams.get("query");
    setSearchQuery(queryParam);
    setTheCurrentPage(parseInt(pageParam));
    setTitle(queryParam);

    // Create URL params string from current search params
    const urlParams = new URLSearchParams(searchParams).toString();
    
    const data = await getProductsByQueryService(queryParam, urlParams);
    
    if (data.status === "failed") {
      console.log("no results found");
      setTotalResults(0);
      setTotalPages(0);
      setProducts([]);
      setIsLoading(false);
      return;
    }
    
    setTotalPages(data.totalPages);
    setTotalResults(data.totalResults);
    setProducts(data.data);
    setIsLoading(false);
    scrollToPageTop();
  }

  // Handle filter changes
  const handleFilterChange = (filterName, optionValue) => {
    // Update local state for displaying checked status
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: prev[filterName] === optionValue ? null : optionValue,
    }));
    
    // Create new params without triggering a re-render
    const newParams = new URLSearchParams(searchParams);
    const isCurrentlySelected = selectedFilters[filterName] === optionValue;
    
    // If currently selected, remove the filter
    if (isCurrentlySelected) {
      newParams.delete(`${filterName}[gte]`);
      newParams.delete(`${filterName}[lte]`);
      newParams.delete(`${filterName}`);
    } else {
      // Otherwise, add the filter
      const queryRange = optionValue.split("-");
      newParams.set(`${filterName}[gte]`, queryRange[0]);
      
      if (filterName === "price" && queryRange.length === 2) {
        newParams.set(`${filterName}[lte]`, queryRange[1]);
      } else if (filterName === "price") {
        newParams.delete(`${filterName}[lte]`);
      }
    }
    
    // Reset to page 1 when filter changes
    newParams.set("page", "1");
    
    // Update URL without causing extra re-renders
    setSearchParams(newParams, { replace: true });
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", value);
    setSearchParams(newParams, { replace: true });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams, { replace: true });
  };

  // Main effect to load products when URL params change
  useEffect(() => {
    if (restrictParams()) {
      fetchProducts();
    }
  }, [searchParams.toString()]); // Using toString() to avoid frequent re-renders

  // Set initial selected filters based on URL params
  useEffect(() => {
    const priceGte = searchParams.get("price[gte]");
    const priceLte = searchParams.get("price[lte]");
    const ratingGte = searchParams.get("rating[gte]");
    const discountGte = searchParams.get("discount[gte]");
    
    const newFilters = { ...selectedFilters };
    
    if (priceGte) {
      const priceValue = priceLte ? `${priceGte}-${priceLte}` : `${priceGte}`;
      newFilters.price = priceValue;
    }
    
    if (ratingGte) {
      newFilters.rating = ratingGte;
    }
    
    if (discountGte) {
      newFilters.discount = discountGte;
    }
    
    setSelectedFilters(newFilters);
    
    const sortParam = searchParams.get("sort");
    if (sortParam) {
      setSortBy(sortParam);
    }
  }, []); // Empty dependency array so this only runs once on mount

  const renderFilterCheckbox = (filter, option) => (
    <label key={option.value} className="flex items-center">
      <input
        type="checkbox"
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={selectedFilters[filter.name] === option.value}
        onChange={() => handleFilterChange(filter.name, option.value)}
      />
      <span className="ml-2 text-gray-600">{option.label}</span>
    </label>
  );

  return (
    <>
      <Helmet>
        {/* Dynamic Title with Query */}
        <title>{`Search Results for "${searchQuery}" | ShoppyX`}</title>

        {/* Description */}
        <meta
          name="description"
          content={`Find results for "${searchQuery}" at ShoppyX. Browse a wide range of products across fashion, electronics, home essentials, and more.`}
        />

        {/* Keywords */}
        <meta
          name="keywords"
          content={`${searchQuery}, buy ${searchQuery}, ${searchQuery} deals, ShoppyX search, online shopping`}
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={`Search: ${searchQuery} | ShoppyX`}
        />
        <meta
          property="og:description"
          content={`Shop the best matches for "${searchQuery}" on ShoppyX. Discover trending items and great deals now.`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://shoppy-x.vercel.app/search?query=${encodeURIComponent(
            searchQuery
          )}`}
        />
        <meta
          property="og:image"
          content="https://shoppy-x.vercel.app/og-default.jpg"
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href={`https://shoppy-x.vercel.app/search?query=${encodeURIComponent(
            searchQuery
          )}`}
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2">
              {totalResults} results found
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* sorting */}
            {/* <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div> */}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 flex-1 sm:flex-none"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {isMobile && showFilters && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-full pb-32">
                {filters.map((filter) => (
                  <div key={filter.name} className="mb-6">
                    <h3 className="font-semibold mb-3 capitalize">{filter.name}</h3>
                    <div className="space-y-2">
                      {filter.options.map((option) =>
                        renderFilterCheckbox(filter, option)
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          {!isMobile && showFilters && (
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                {filters.map((filter) => (
                  <div key={filter.name} className="mb-6 last:mb-0">
                    <h3 className="font-semibold mb-3 capitalize">{filter.name}</h3>
                    <div className="space-y-2">
                      {filter.options.map((option) =>
                        renderFilterCheckbox(filter, option)
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="h-[60vh]">
                <Loader></Loader>
              </div>
            ) : totalResults === 0 ? (
              <NoProductsFound></NoProductsFound>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                {products?.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="mt-8 sm:mt-12 flex justify-center">
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(theCurrentPage - 1)}
                    disabled={theCurrentPage === 1}
                    className="px-3 sm:px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 sm:px-4 py-2 border rounded-lg 
                      ${
                        theCurrentPage === i + 1
                          ? "bg-gray-900 text-white"
                          : "bg-gray-50 text-black"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(theCurrentPage + 1)}
                    disabled={theCurrentPage === totalPages}
                    className="px-3 sm:px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchedProducts;