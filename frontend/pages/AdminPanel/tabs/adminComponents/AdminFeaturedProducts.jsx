import { AlertTriangle, Edit, ImagePlus, Plus, Trash, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Modal from "../../common/Modal.jsx";
import ImageUploadSection from "../../common/ImageUploadSection.jsx";
import updateProductService from "../../../../services/products/updateProductService.js";
import successToastMessage from "../../../../utils/successToastMessage.js";
import deleteProductService from "../../../../services/products/deleteProductService.js";
import selectEditCategory from "../../../../utils/selectEditCategory.js";
import SmallLoader from "../../../../components/SmallLoader.jsx";

function AdminFeaturedProducts({allCategories,allProducts,fetchAllProducts,isLoading}) {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // State for modals and forms
 const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating,setIsUpdating]= useState(false)
  const [isDeleting,setIsDeleting]= useState(false)

  // State for form management
 
  const [editProductForm, setEditProductForm] = useState({
    id: null,
    name: "",
    category: "",
    inStock:null,
    featuredProduct:"",
    actualPrice: "",
    discount: "",
    description: "",
    availableSize: "",
    features: "",
  });

  // Image states
  const [editProductImages, setEditProductImages] = useState([]);
  // Item to delete state
  const [itemToDelete, setItemToDelete] = useState(null);

  // References
  
  const editProductImageRef = useRef(null);

  // Image change handler for edit product
  const handleEditProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImagesWithPreview = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    // Combine existing product images with new uploads, limit to 5
    const updatedImages = [...editProductImages, ...newImagesWithPreview].slice(0, 5);
    setEditProductImages(updatedImages);
  };

  // Remove image from new product
 

  // Remove image from edit product
  const removeEditProductImage = (index) => {
    const updatedImages = editProductImages.filter((_, i) => i !== index);
    setEditProductImages(updatedImages);
  };

  // Open edit product modal
  
  const openEditProductModal = (product) => {
    setEditProductForm({
      id: product._id,
      name: product.name,
      category: selectEditCategory(allCategories,product),
      inStock: product.inStock,
      featuredProduct: product.featuredProduct? "yes":"no",
      actualPrice: product.actualPrice,
      discount: product.discount,
      description: product.description,
      availableSize: product.availableSize,
      features: product.features,
    });
    
    // Convert existing product images to the new format
    const existingImages = product.images.map(img => ({
      preview: img.url,
      file: null // Existing images don't have a file object
    })).slice(0, 5);
    
    setEditProductImages(existingImages);
    setShowEditProductModal(true);
  };

  

  // Handle input changes for edit product
  const handleEditProductInputChange = (e) => {
    const { name, value } = e.target;
    setEditProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  

  // Submit edited product
  async function handleEditProductSubmit(e) {
    e.preventDefault();
    if(editProductForm.discount<0 || editProductForm.actualPrice<0||editProductForm.inStock<0)
      return
    setIsUpdating(true)
    // console.log(editProductImages)
    // console.log(editProductForm)
    const formData = new FormData()
    formData.append("name", editProductForm.name);
  formData.append("availableSize", editProductForm.availableSize);
  formData.append("category", editProductForm.category);
  formData.append("inStock", editProductForm.inStock);
  formData.append("description", editProductForm.description);
  formData.append("discount", editProductForm.discount);

  formData.append("featuredProduct", editProductForm.featuredProduct==="yes");
  formData.append("features", editProductForm.features);
  formData.append("actualPrice", editProductForm.actualPrice);
  editProductImages.forEach(img=>{
    if(img.file)
      formData.append("images",img.file)
  })
  editProductImages.forEach(img=>{
    if(img.preview.startsWith("http"))
      formData.append("imageUrls",img.preview)
  })
  const data = await updateProductService(editProductForm.id,formData)
  // console.log("updated data ", data )
  data.status==="success" && successToastMessage("Product Updated Successfully")
  setIsUpdating(false)
    setShowEditProductModal(false);
    setEditProductImages([]);
    fetchAllProducts()
  };

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
      fetchAllProducts()
      successToastMessage("Product Deleted Successfully!")
    };

  // Open delete modal
  const openDeleteModal = (type, id) => {
    setItemToDelete({ type, id });
    setShowDeleteModal(true);
  };

  

  useEffect(() => {
    setFeaturedProducts(allProducts)
    // console.log("from child",allCategories)
  }, [allProducts,allCategories]);

 

  return (
    <>
      <section className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Featured Products
          </h2>
          
        </div>
        {
          isLoading?<SmallLoader></SmallLoader>:
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {featuredProducts?.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100 group relative"
            >
              {/* Image Container */}
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-2 right-2 space-y-1">
                  {product.discount > 0 && (
                    <div className="bg-red-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-full">
                      -{product.discount}%
                    </div>
                  )}
                  {product.inStock > 0 && (
                    <div className="bg-yellow-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded">
                      {product.inStock} Left
                    </div>
                  )}
                </div>
              </div>
        
              {/* Product Details */}
              <div className="p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate mb-1 sm:mb-2">
                  {product.name}
                </h3>
                
                {/* Price Section */}
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-indigo-600">
                    ₹{product.finalPrice}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                      ₹{product.actualPrice}
                    </span>
                  )}
                </div>
        
                {/* Size Tags */}
                <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5">
                  {product.availableSize?.split(",")?.map((size, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {size.trim()}
                    </span>
                  ))}
                </div>
        
                {/* Action Buttons */}
                <div className="flex gap-2 mt-3 sm:mt-4 justify-end">
                  <button
                    onClick={() => openEditProductModal(product)}
                    className="p-1.5 sm:p-2 hover:bg-indigo-100 rounded-full transition-colors duration-200 text-indigo-600"
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal("product", product._id)}
                    className="p-1.5 sm:p-2 hover:bg-red-100 rounded-full transition-colors duration-200 text-red-600"
                  >
                    <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        }
      </section>

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
                {
                  allCategories?.map((category)=>(
                    <option key={category._id} value={category.value}>{category.title}</option>
                  ))
                }
               
              </select>
            </div>
          </div>
          {/* description and featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* discount */}
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
              />
              {
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
              />
            </div>
            {
                editProductForm.discount<0 && <p className="text-red-500">Price can&apos;t be a negetive value</p>
              }
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
              />
              {
                editProductForm.inStock<0 && <p className="text-red-500">Price can&apos;t be a negetive value</p>
              }
            </div>
            </div>
          {/* size  */}
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
                value={editProductForm.availableSize||""}
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
             >

          </ImageUploadSection>
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              disabled={isUpdating}
          >
           {isUpdating?"Updating...":"Update Product"} 
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
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              {
                isDeleting?"Delete...":"Delete"
              }
              
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AdminFeaturedProducts;