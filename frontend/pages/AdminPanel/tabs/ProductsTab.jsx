import {
  AlertTriangle,
  Edit,
  ImagePlus,
  Plus,
  Trash,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Modal from "../common/Modal";
import ImageUploadSection from "../common/ImageUploadSection";
import updateProductService from "../../../services/products/updateProductService.js";
import successToastMessage from "../../../utils/successToastMessage.js";
import HomeAdminFeaturedProducts from "./adminComponents/AdminFeaturedProducts.jsx";
import getAllCategoriesService from "../../../services/categories/getAllCategoriesService.js";
import createProductService from "../../../services/products/createProductService.js";
import deleteProductService from "../../../services/products/deleteProductService.js";
import selectEditCategory from "../../../utils/selectEditCategory.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import getProductsByPageService from "../../../services/products/getProductsByPageService.js";
import getAllFeaturedProductsService from "../../../services/products/getAllFeaturedProductsService.js";
import SmallLoader from "../../../components/SmallLoader.jsx";

function ProductsTab() {
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // State for modals and forms
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [featuredProductsLoading, setfeaturedProductsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalPages,setTotalPages] = useState(1)
  const [currentPage,setCurrentPage] = useState(1)

  // State for form management
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    category: "",
    actualPrice: "",
    inStock: 0,
    featuredProduct: "no",
    discount: "",
    description: "",
    availableSize: "",
    features: "",
  });
  const [editProductForm, setEditProductForm] = useState({
    id: null,
    name: "",
    category: "",
    inStock: null,
    featuredProduct: "",
    actualPrice: "",
    discount: "",
    description: "",
    availableSize: "",
    features: "",
  });

  // Image states
  const [newProductImages, setNewProductImages] = useState([]);
  const [editProductImages, setEditProductImages] = useState([]);

  // References
  const newProductImageRef = useRef(null);
  const editProductImageRef = useRef(null);

  // Item to delete state
  const [itemToDelete, setItemToDelete] = useState(null);

  // Image change handler for new product
  const handleNewProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImagesWithPreview = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    // Limit to 5 images
    const updatedImages = [...newProductImages, ...newImagesWithPreview].slice(
      0,
      5
    );
    setNewProductImages(updatedImages);
  };

  // Image change handler for edit product
  const handleEditProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImagesWithPreview = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    // Combine existing product images with new uploads, limit to 5
    const updatedImages = [...editProductImages, ...newImagesWithPreview].slice(
      0,
      5
    );
    setEditProductImages(updatedImages);
  };

  // Remove image from new product
  const removeNewProductImage = (index) => {
    const updatedImages = newProductImages.filter((_, i) => i !== index);
    setNewProductImages(updatedImages);
  };

  // Remove image from edit product
  const removeEditProductImage = (index) => {
    const updatedImages = editProductImages.filter((_, i) => i !== index);
    setEditProductImages(updatedImages);
  };

  // Open add product modal
  const openAddProductModal = () => {
    setNewProductForm({
      name: "",
      category: allCategories.length > 0 ? allCategories[0].value : "",
      actualPrice: "",
      inStock: 0,
      featuredProduct: "no",
      discount: "",
      description: "",
      availableSize: "",
      features: "",
    });
    setNewProductImages([]);
    setShowAddProductModal(true);
  };

  
  // Open edit product modal
  const openEditProductModal = (product) => {
    setEditProductForm({
      id: product._id,
      name: product.name,
      category: selectEditCategory(allCategories,product),
      inStock: product.inStock,
      featuredProduct: product.featuredProduct ? "yes" : "no",
      actualPrice: product.actualPrice,
      discount: product.discount,
      description: product.description,
      availableSize: product.availableSize,
      features: product.features,
    });

    // Convert existing product images to the new format
    const existingImages = product.images
      .map((img) => ({
        preview: img.url,
        file: null, // Existing images don't have a file object
      }))
      .slice(0, 5);

    setEditProductImages(existingImages);
    setShowEditProductModal(true);
  };

  // Handle input changes for new product
  const handleNewProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for edit product
  const handleEditProductInputChange = (e) => {
    const { name, value } = e.target;
    setEditProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit new product
  async function handleAddProductSubmit (e) {
    e.preventDefault();
    // console.log(newProductForm);
    // console.log(newProductImages);
    if(newProductForm.discount<0 || newProductForm.actualPrice<0||newProductForm.inStock<0)
      return 
    setIsUploading(true)
    const formData = new FormData();
    formData.append("name", newProductForm.name);
    formData.append("availableSize", newProductForm.availableSize);
    formData.append("category", newProductForm.category);
    formData.append("inStock", newProductForm.inStock);
    formData.append("description", newProductForm.description);
    formData.append("discount", newProductForm.discount);

    formData.append(
      "featuredProduct",
      newProductForm.featuredProduct === "yes"
    );
    formData.append("features", newProductForm.features);
    formData.append("actualPrice", newProductForm.actualPrice);
    newProductImages.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });
    const data = await createProductService(formData)
    // console.log(data)
    setIsUploading(false)
    // console.log(Object.fromEntries(formData.entries()))
    setShowAddProductModal(false);
    setNewProductImages([]);
    successToastMessage("New Product Added!")
    // fetchAllProducts()
    fetchAllFeaturedProducts()
    fetchProductsByPage()
  };

  // Submit edited product
  async function handleEditProductSubmit(e) {
    e.preventDefault();
    // console.log(editProductImages);
    // console.log(editProductForm);
    if(editProductForm.discount<0 || editProductForm.actualPrice<0||editProductForm.inStock<0)
      return 
    setIsUploading(true);
    const formData = new FormData();
    formData.append("name", editProductForm.name);
    formData.append("availableSize", editProductForm.availableSize);
    formData.append("category", editProductForm.category);
    formData.append("inStock", editProductForm.inStock);
    formData.append("description", editProductForm.description);
    formData.append("discount", editProductForm.discount);

    formData.append(
      "featuredProduct",
      editProductForm.featuredProduct === "yes"
    );
    formData.append("features", editProductForm.features);
    formData.append("actualPrice", editProductForm.actualPrice);
    editProductImages.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });
    editProductImages.forEach((img) => {
      if (img.preview.startsWith("http"))
        formData.append("imageUrls", img.preview);
    });
    const data = await updateProductService(editProductForm.id, formData);
    // console.log("updated data ", data);
    data.status === "success" &&
      successToastMessage("Product Updated Successfully");
    setIsUploading(false);

    setShowEditProductModal(false);
    setEditProductImages([]);
    // fetchAllProducts();
    fetchAllFeaturedProducts()
    fetchProductsByPage()
  }

  // Delete product
  async function handleDelete () {
    if (!itemToDelete) return;

    const { id } = itemToDelete;
    setIsDeleting(true)
    // console.log("delete item id",id)
    const data = await deleteProductService(id)
    // console.log(data)
    setIsDeleting(false)
    setShowDeleteModal(false);
    setItemToDelete(null);
    fetchAllFeaturedProducts()
    fetchProductsByPage()
    successToastMessage("Product Deleted Successfully!")
  };

  // Open delete modal
  const openDeleteModal = (type, id) => {
    setItemToDelete({ type, id });

    setShowDeleteModal(true);
  };
  const [searchParams,setSearchParams]=useSearchParams()
 

  function restrictProductsParams(){
    const page = searchParams.get("page")
    // console.log("the page",page)
    if(!page || page<1)
      setSearchParams({page:1})
  }

  

  //fetch featured products
  async function fetchAllFeaturedProducts(){
    setfeaturedProductsLoading(true)
    const filteredProduct = await getAllFeaturedProductsService();
    setFeaturedProducts(filteredProduct.data)// featured product after updateon not rendering properly
    setfeaturedProductsLoading(false)
  }
  //fetch products by page
  async function fetchProductsByPage() {
    const page = searchParams.get("page")
    setProductsLoading(true)
    setCurrentPage(parseInt(page))
    const data = await getProductsByPageService(page);
    // console.log("all Products", data);
    setTotalPages(data.totalPages)
  
    setAllProducts(data.data)
    setProductsLoading(false)
  }
  async function fetchAllCategories() {
    const { data } = await getAllCategoriesService();
    setAllCategories(data);
  }

  useEffect(()=>{
    restrictProductsParams()
    fetchProductsByPage()
  },[searchParams])

  useEffect(() => {
    restrictProductsParams()
    fetchAllCategories();
    fetchAllFeaturedProducts()
    fetchProductsByPage()
  }, []);


  return (
    <>
      <HomeAdminFeaturedProducts
        allCategories={allCategories}
        allProducts={featuredProducts}
        fetchAllProducts={fetchAllFeaturedProducts}
        isLoading={featuredProductsLoading}
      ></HomeAdminFeaturedProducts>
      {/* products */}
      <section className="bg-white mt-4 rounded-2xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
          <button
            onClick={openAddProductModal}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add
          </button>
        </div>
        {
          productsLoading?<SmallLoader></SmallLoader>:
          <>
          {/* the fetched p */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-3">
              {allProducts?.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 group"
                >
                  <div className="relative">
                    <div className="h-56 bg-gray-100 overflow-hidden">
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{product.discount}%
                      </div>
                    )}
                    {product.inStock > 0 && (
                      <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Only {product.inStock} Left!
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-lg font-bold text-indigo-600">
                      ₹{(product.finalPrice)}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.actualPrice}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {product.availableSize?.split(",")?.map((size, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-4 justify-end">
                      <button
                        onClick={() => openEditProductModal(product)}
                        className="p-2 hover:bg-indigo-100 rounded-full transition-colors duration-200 text-indigo-600"
                        aria-label="Edit product"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal("product", product._id)}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors duration-200 text-red-600"
                        aria-label="Delete product"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* pagination */}
            <div className="mt-8 sm:mt-12 flex justify-center">
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => {
                      setSearchParams({page:currentPage-1})
                    }}
                    disabled={currentPage === 1}
                    className="px-3 sm:px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {
                    Array.from({length:totalPages},(_,i)=>(
                      <button key={i+1}
                      onClick={()=>{
                        setSearchParams({page:i+1})
                      }}
                      className={
                        `px-3 sm:px-4 py-2 border rounded-lg 
                        ${currentPage===i+1?"bg-gray-900 text-white"
                        :"bg-gray-50 text-black"}`}>
                        {i+1}
                      </button>
                    ))
                  }
                  
                  <button
                    // onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalProductsPage))}
                    onClick={() => {
                      setSearchParams({page:currentPage+1})
                    }}
                    disabled={currentPage === totalPages}
                    className="px-3 sm:px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
          </>
        }
      </section>

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddProductModal}
        onClose={() => {
          setShowAddProductModal(false);
          setNewProductImages([]);
        }}
        title="Add Product"
      >
        <form
          className="space-y-4 h-[80vh] overflow-y-auto"
          onSubmit={handleAddProductSubmit}
        >
          {/* name & category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Product name"
                value={newProductForm.name}
                onChange={handleNewProductInputChange}
                required
              />
            </div>
            {/* category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={newProductForm.category}
                onChange={handleNewProductInputChange}
                required
              >
                {allCategories?.map((category) => (
                  <option key={category._id} value={category.value}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* description and featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                className="w-full h-[100px] px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Product description"
                value={newProductForm.description}
                onChange={handleNewProductInputChange}
                required
              />
            </div>
            {/* featured */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured Product
              </label>
              <select
                name="featuredProduct"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={newProductForm.featuredProduct}
                onChange={handleNewProductInputChange}
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          {/* price and discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="actualPrice"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="0.00"
                value={newProductForm.actualPrice}
                onChange={handleNewProductInputChange}
                required
              />
              {
                newProductForm.actualPrice<0 && <p className="text-red-500">Price can&apos;t be a negetive value</p>
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="0%"
                value={newProductForm.discount}
                onChange={handleNewProductInputChange}
                required
              />{
                newProductForm.discount<0 && <p className="text-red-500">Discount can&apos;t be a negetive value</p>
              }
            </div>
          </div>
          {/* instock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                In Stock
              </label>
              <input
                type="number"
                name="inStock"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="0"
                value={newProductForm.inStock}
                onChange={handleNewProductInputChange}
                required
              />
              {
                newProductForm.inStock<0 && <p className="text-red-500">Can&apos;t be a negetive value</p>
              }
            </div>
          </div>
          {/* sizes and features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Sizes
              </label>
              <input
                type="text"
                name="availableSize"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="S, M, L, XL"
                value={newProductForm.availableSize}
                onChange={handleNewProductInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features
              </label>
              <input
                type="text"
                name="features"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Feature 1, Feature 2"
                value={newProductForm.features}
                onChange={handleNewProductInputChange}
                required
              />
            </div>
          </div>

          <ImageUploadSection
            theImages={newProductImages}
            onImageChange={handleNewProductImageChange}
            removeImage={removeNewProductImage}
            imageRef={newProductImageRef}
          ></ImageUploadSection>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            {
              isUploading?"Adding...":"Add Product"
            }
            
          </button>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditProductModal}
        onClose={() => {
          setShowEditProductModal(false);
          setEditProductImages([]);
        }}
        title="Edit Product"
      >
        <form
          className="space-y-4 h-[80vh] overflow-y-auto"
          onSubmit={handleEditProductSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Product name"
                value={editProductForm.name}
                onChange={handleEditProductInputChange}
                required
              />
            </div>
            {/* edit category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={editProductForm.category}
                onChange={handleEditProductInputChange}
                required
              >
                {allCategories?.map((category) => (
                  <option key={category._id} value={category.value}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* description and featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                className="w-full h-[100px] px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Product description"
                value={editProductForm.description}
                onChange={handleEditProductInputChange}
                required
              />
            </div>
            {/* featured */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured Product
              </label>
              <select
                name="featuredProduct"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={editProductForm.featuredProduct}
                onChange={handleEditProductInputChange}
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          {/* price and discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="actualPrice"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="0.00"
                value={editProductForm.actualPrice}
                onChange={handleEditProductInputChange}
                required
              />{
                editProductForm.actualPrice<0 && <p className="text-red-500">Price can&apos;t be a negetive value</p>
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="0%"
                value={editProductForm.discount}
                onChange={handleEditProductInputChange}
                required
              />{
                editProductForm.discount<0 && <p className="text-red-500">Discount can&apos;t be a negetive value</p>
              }
            </div>
          </div>
          {/* instock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                In Stock
              </label>
              <input
                type="number"
                name="inStock"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="0.00"
                value={editProductForm.inStock}
                onChange={handleEditProductInputChange}
                required
              />{
                editProductForm.inStock<0 && <p className="text-red-500">Can&apos;t be a negetive value</p>
              }
            </div>
          </div>
          {/* size and features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Size
              </label>
              <input
                type="text"
                name="availableSize"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="S, M, L, XL"
                value={editProductForm.availableSize || ""}
                onChange={handleEditProductInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features
              </label>
              <textarea
                name="features"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Feature 1, Feature 2"
                value={editProductForm.features}
                onChange={handleEditProductInputChange}
                required
              />
            </div>
          </div>

          <ImageUploadSection
            theImages={editProductImages}
            onImageChange={handleEditProductImageChange}
            removeImage={removeEditProductImage}
            imageRef={editProductImageRef}
            isEditing={true}
          ></ImageUploadSection>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            {isUploading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-red-50 text-red-600 rounded-lg">
            <AlertTriangle className="w-6 h-6 mr-3" />
            <p>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
            disabled={isDeleting}
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              {
                isDeleting?"Deleting...":"Delete"
              }
              
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ProductsTab;
