import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import Product from "../components/Product";
import Loader from "../components/Loader.jsx";
import getProductsByCategoryService from "../services/products/getProductsByCategoryService.js";
import scrollToPageTop from "../utils/scrollToPageTop.js";
import NoProductsFound from "../components/NoProductsFound.jsx";
import getCategoryByValueService from "../services/categories/getCategoryByValueService.js";
import { Helmet } from "react-helmet-async";

const sortOptions = [
  { name: "Newest", value: "newest" },
  { name: "Price: Low to High", value: "price_asc" },
  { name: "Price: High to Low", value: "price_desc" },
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

const CategoryProducts = () => {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    price: null,
    rating: null,
    discount: null,
  });
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  // Track window size for mobile display
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // Update URL with sort parameter
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", e.target.value);
    setSearchParams(newParams);
  };

  // Handle filter change
  const handleFilterChange = (filterName, optionValue) => {
    // Update selected filters state
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: prev[filterName] === optionValue ? null : optionValue,
    }));
    
    // Build query parameters
    const queryRange = optionValue.split("-");
    const newParams = new URLSearchParams(searchParams);
    const isSelected = selectedFilters[filterName] === optionValue;
    
    // Toggle filter
    if (isSelected) {
      newParams.delete(`${filterName}[gte]`);
      newParams.delete(`${filterName}[lte]`);
      newParams.delete(filterName);
    } else {
      newParams.set(`${filterName}[gte]`, queryRange[0]);
      if (filterName === "price" && queryRange.length === 2) {
        newParams.set(`${filterName}[lte]`, queryRange[1]);
      } else if (filterName === "price") {
        newParams.delete(`${filterName}[lte]`);
      }
      newParams.set("page", "1"); // Reset to page 1 when applying a filter
    }
    
    setSearchParams(newParams);
  };

  // Render filter checkboxes
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

  // Fetch category title
  async function fetchCategoryTitle() {
    try {
      const data = await getCategoryByValueService(category);
      setTitle(data.title);
    } catch (error) {
      console.error("Error fetching category title:", error);
    }
  }

  // Fetch products
  async function fetchProducts() {
    setIsLoading(true);
    try {
      const data = await getProductsByCategoryService(category, searchParams.toString());
      setProducts(data.data);
      setTotalResults(data.totalResults);
      setTotalPages(data.totalPages);
      scrollToPageTop();
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage);
    setSearchParams(newParams);
  };
  
  // Initialize page parameter if missing
  useEffect(() => {
    if (!searchParams.has("page")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", "1");
      setSearchParams(newParams, { replace: true });
    }
  }, []);
  
  // Fetch category title on mount
  useEffect(() => {
    fetchCategoryTitle();
  }, [category]);
  
  // Fetch products when params change
  useEffect(() => {
    if (searchParams.has("page")) {
      fetchProducts();
    }
  }, [searchParams, category]);

  return (
    <>
      <Helmet>
        <title>{`${title} Products | ShoppyX`}</title>
        <meta
          name="description"
          content={`Browse top-rated ${title.toLowerCase()} products at ShoppyX. Discover the best deals, new arrivals, and customer favorites.`}
        />
        <meta
          name="keywords"
          content={`buy ${category}, ${category} products, ${category} deals, ${category} shopping, ShoppyX ${category}`}
        />
        <meta property="og:title" content={`${category} Products | ShoppyX`} />
        <meta
          property="og:description"
          content={`Explore a wide range of ${category.toLowerCase()} at ShoppyX. Great prices, trending items, and fast delivery.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://shoppy-x.vercel.app/categories/${category.toLowerCase()}`} />
        <meta
          property="og:image"
          content="https://shoppy-x.vercel.app/og-default.jpg"
        />
        <link rel="canonical" href={`https://shoppy-x.vercel.app/categories/${category.toLowerCase()}`} />
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
            {/* <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={handleSortChange}
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
                <Loader />
              </div>
            ) : totalResults === 0 ? (
              <NoProductsFound />
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
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
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
                        currentPage === i + 1
                          ? "bg-gray-900 text-white"
                          : "bg-gray-50 text-black hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
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

export default CategoryProducts;