import React, { useEffect, useRef, useState } from "react";
import { Plus, Edit, Trash, X, AlertTriangle } from "lucide-react";
import Modal from "../common/Modal";
import SmallLoader from "../../../components/SmallLoader.jsx"
import createCategoryService from "../../../services/categories/createCategoryService.js";
import getAllCategoriesService from "../../../services/categories/getAllCategoriesService.js";
import successToastMessage from "../../../utils/successToastMessage.js";
import updateCategoryService from "../../../services/categories/updateCategoryService.js";
import deleteCategoryService from "../../../services/categories/deleteCategoryService.js";
const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    title: "",
    value: "",
    featuredCategory:"no"
  });
  const [editCategory,setEditCategory]=useState({})
  const [editCategoryImage,setEditCategoryImage]=useState("")
  const [categoryIdToDelete,setCategoryIdToDelete]=useState(null)
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imageFilePreview, setImageFilePreview] = useState(null);
  const [isError,setIsError] = useState(false)
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);
  function resetAddCategoryForm(){
    setNewCategory({
      title: "",
      value: "",
      featuredCategory:"no"
    })
  }

  function handleImageFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (imageFilePreview)
        // if already exist clean up for memory leak
        URL.revokeObjectURL(imageFilePreview);
      //at first set the file
      setImageFile(file);
      //now genereate url for preview
      const imageUrl = URL.createObjectURL(file);
      setImageFilePreview(imageUrl);
    }
  }
  // clean up for memory leak
  useEffect(() => {
    return () => {
      if (imageFilePreview) URL.revokeObjectURL(imageFilePreview);
    };
  }, [imageFilePreview]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handleEditInputChange(e) {
    const { name, value } = e.target;
    setEditCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleRemoveImage(e) {
    e.preventDefault();
    setImageFile(null);
    setEditCategoryImage("")
    //handling for edit form cuz then it will be url 

    setImageFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleNewSubmit(e) {
    e.preventDefault();
    setIsUploading(true);
    setIsError(false)
    // console.log("data",newCategory);
    // console.log(imageFile);
    const formData = new FormData();
    formData.append("title", newCategory.title);
    formData.append("value", newCategory.value);
    formData.append("featuredCategory",newCategory.featuredCategory)
    formData.append("image", imageFile);
   
      const {data} = await createCategoryService(formData);
      // console.log(data);
      if(data.status==="error"){
        setIsError(true)
        setIsUploading(false)
        return
      }
      setIsError(false)
    setIsUploading(false)
    setShowModal(false);
    resetAddCategoryForm()
    fetchCategories();
    successToastMessage("Categories Added!");
  }

  function openEditModalForm(category){
    setShowEditModal(true)
    setEditCategory({
      ...category,
      featuredCategory:category.featuredCategory?"yes":"no"
    })
    setEditCategoryImage(category.image.url)
    // console.log(category)
    setImageFilePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  //close the add category modal form
  function closeModalForAddCategory(){
    resetAddCategoryForm()
    setImageFilePreview(null);
    setIsError(false)
    setShowModal(false);
  }
  async function handleEditSubmit(e){
    e.preventDefault()
    setIsError(false)
    setIsUploading(true)
    // console.log(editCategory)
    // console.log(imageFile)
    
    const formData = new FormData()
    formData.append("title",editCategory.title)
    formData.append("value",editCategory.value)
    formData.append("featuredCategory",editCategory.featuredCategory)
    if(imageFile)
    formData.append("image",imageFile)
    const {data} = await updateCategoryService(editCategory._id,formData)
    if(data.status==="error"){
      setIsError(true)
      setIsUploading(false)
      return
    } 
    // console.log("updated",data)
    setIsUploading(false)
    setShowEditModal(false)
    fetchCategories()
    successToastMessage("Category Updated!")

  }
  async function handleCategoryDelete(){
    setIsDeleting(true)
    await deleteCategoryService(categoryIdToDelete)
    
    setIsDeleting(false)
    setShowDeleteModal(false)
    fetchCategories()
    successToastMessage("Category Deleted!")
  }
  // Example categories

  async function fetchCategories() {
    setIsLoading(true)
    const { data } = await getAllCategoriesService();
    // console.log(data);
    setCategories(data);
    setIsLoading(false)
  }
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add
        </button>
      </div>
    {/* categories */}
    {
      isLoading?<SmallLoader></SmallLoader>:
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-0">
        {categories?.map((category) => (
          <div
            key={category._id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
          >
            <div className="relative aspect-[4/3] bg-gray-50">
              <img
                src={category.image.url}
                alt={category.title}
                className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-95"
              />
            </div>
            <div className="p-5 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {category.title}
              </h3>
              <div className="flex gap-3">
                <button className="flex-1 py-2 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md flex items-center justify-center transition-all duration-200 border border-blue-100"
                  onClick={()=>openEditModalForm(category)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  <span className="text-sm">Edit</span>
                </button>
                <button className="flex-1 py-2 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md flex items-center justify-center transition-all duration-200 border border-red-100"
                  onClick={()=>{
                    setCategoryIdToDelete(category._id)
                    setShowDeleteModal(true)
                  }}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    }
        {/* add new category modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          closeModalForAddCategory()
        }}
        title="Add Category"
      >
        <form className="space-y-4 max-h-[80vh] overflow-y-auto" onSubmit={handleNewSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={newCategory.title}
              name="title"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter category name"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              type="text"
              value={newCategory.value}
              name="value"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter category name"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured Category
              </label>
              <select
                name="featuredCategory"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={newCategory.featuredCategory}
                onChange={handleInputChange}
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            {
              isError && 
            <p className="text-red-500">Category with that Title or Value already exist </p>
            }
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              className="w-full"
              required
            />
          </div>
          {imageFilePreview && (
            <div className="mt-4">
              <p className="text-lg font-medium">Image Preview:</p>
              <div className="relative w-32 h-32">
                <X
                  className="text-white  bg-red-500 absolute right-1 hover:cursor-pointer hover:bg-red-400 rounded-full"
                  onClick={handleRemoveImage}
                ></X>
                <img
                  src={imageFilePreview}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isUploading ? "Uploading..." : "Add Category"}
          </button>
        </form>
      </Modal>
        {/* edit category modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
        }}
        title="Edit Category"
      >
        <form className="space-y-4 max-h-[80vh] overflow-y-auto" onSubmit={handleEditSubmit}> 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={editCategory.title}
              name="title"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter category name"
              onChange={handleEditInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              type="text"
              value={editCategory.value}
              name="value"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter category name"
              onChange={handleEditInputChange}
              required
            />
          </div>
          {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured Category
              </label>
              <select
                name="featuredCategory"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={editCategory.featuredCategory}
                onChange={handleEditInputChange}
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div> */}
            {
              isError && 
            <p className="text-red-500">Category with that Title or Value already exist </p>
            }
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              className="w-full"
            />
          </div>
          {(imageFilePreview || editCategoryImage) && (
            <div className="mt-4">
              <p className="text-lg font-medium">Image Preview:</p>
              <div className="relative w-32 h-32">
                <X
                  className="text-white  bg-red-500 absolute right-1 hover:cursor-pointer hover:bg-red-400 rounded-full"
                  onClick={handleRemoveImage}
                ></X>
                <img
                  src={imageFilePreview || editCategoryImage}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={isUploading}
          >
            {isUploading ? "Updating..." : "Update"}
          </button>
        </form>
      </Modal>
      {/* Delete Confirmation Modal */}
            <Modal
              isOpen={showDeleteModal}
              onClose={() => {
                setShowDeleteModal(false);
                setCategoryIdToDelete(null);
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
                    onClick={handleCategoryDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </Modal>
    </div>
  );
};

export default CategoriesTab;
