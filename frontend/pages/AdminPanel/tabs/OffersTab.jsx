import React, { useEffect, useRef, useState } from "react";
import { Plus, Edit, Trash, X, AlertTriangle } from "lucide-react";
import Modal from "../common/Modal";
import getAllOffersService from "../../../services/offers/getAllOffersService.js";
import successToastMessage from "../../../utils/successToastMessage.js";
import updateOfferService from "../../../services/offers/updateOfferService.js";
import deleteOfferService from "../../../services/offers/deleteOfferService.js";
import createOfferService from "../../../services/offers/createOfferService.js";
import SmallLoader from "../../../components/SmallLoader.jsx";
const CategoriesTab = () => {
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({
    title: "",
    value: "",
    discount:0,
    description:""
  });
  const [editOffer,setEditOffer]=useState({})
  const [editOfferImage,setEditOfferImage]=useState("")
  const [offerIdToDelete,setOfferIdToDelete]=useState(null)
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
  function resetAddOfferForm(){
    setNewOffer({
      title: "",
      value: "",
      discount:0,
      description:""
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
    // console.log("changing",name,"for",value)
    setNewOffer((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handleEditInputChange(e) {
    const { name, value } = e.target;
    setEditOffer((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleRemoveImage(e) {
    e.preventDefault();
    setImageFile(null);
    setEditOfferImage("")
    //handling for edit form cuz then it will be url 

    setImageFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleNewSubmit(e) {
    e.preventDefault();
    setIsUploading(true);
    setIsError(false)
    // console.log("data",newOffer);
    // console.log(imageFile);
    const formData = new FormData();
    formData.append("title", newOffer.title);
    formData.append("value", newOffer.value);
    formData.append("discount",newOffer.discount)
    formData.append("description",newOffer.description)
    formData.append("image", imageFile);
   
      const {data} = await createOfferService(formData);
      // console.log(data);
      if(data.status==="error"){
        setIsError(true)
        setIsUploading(false)
        return
      }
      setIsError(false)
    setIsUploading(false)
    setShowModal(false);
    resetAddOfferForm()
    fetchOffers();
    successToastMessage("Offer Added!");
  }

  function openEditModalForm(offer){
    setShowEditModal(true)
    setEditOffer({
      ...offer,
      // featuredOffer:offer.featuredOffer?"yes":"no"
    })
    setEditOfferImage(offer.image.url)
    // console.log(offer)
    setImageFilePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  //close the add category modal form
  function closeModalForAddOffer(){
    resetAddOfferForm()
    setImageFilePreview(null);
    setIsError(false)
    setShowModal(false);
  }
  async function handleEditSubmit(e){
    e.preventDefault()
    setIsError(false)
    setIsUploading(true)
    // console.log(editOffer)
    // console.log(imageFile)
    
    const formData = new FormData()
    formData.append("title",editOffer.title)
    formData.append("value",editOffer.value)
    formData.append("description",editOffer.description)
    formData.append("discount",editOffer.discount)
    if(imageFile){
      formData.append("image",imageFile)
      formData.append("hasImageChanged",true)
    }
    const {data} = await updateOfferService(editOffer._id,formData)
    if(data.status==="error"){
      setIsError(true)
      setIsUploading(false)
      return
    } 
    // console.log("updated",data)
    setIsUploading(false)
    setShowEditModal(false)
    fetchOffers()
    successToastMessage("Offer Updated!")

  }
  async function handleOfferDelete(){
    setIsDeleting(true)
    await deleteOfferService(offerIdToDelete)
    
    setIsDeleting(false)
    setShowDeleteModal(false)
    fetchOffers()
    successToastMessage("Offer Deleted!")
  }
  // Example categories

  async function fetchOffers() {
    setIsLoading(true)
    const data  = await getAllOffersService();
    // console.log(data);
    setOffers(data.data);
    setIsLoading(false)
  }
  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Offers</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add
        </button>
      </div>
    {/* offers */}
    {
      isLoading?<SmallLoader></SmallLoader>:
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-0">
        {offers?.map((offer) => (
          <div
          key={offer._id}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col h-full"
        >
          <div className="relative h-48 bg-gray-50 overflow-hidden">
            <img
              src={offer.image.url}
              alt={offer.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              {offer.discount}% OFF
            </span>
          </div>
        
          <div className="p-5 flex flex-col flex-grow border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{offer.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{offer.description}</p>
        
            <div className="mt-auto flex gap-3">
              <button
                onClick={() => openEditModalForm(offer)}
                className="flex-1 py-2 px-3 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 border border-blue-200"
              >
                <Edit className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Edit</span>
              </button>
              <button
                onClick={() => {
                  setOfferIdToDelete(offer._id);
                  setShowDeleteModal(true);
                }}
                className="flex-1 py-2 px-3 text-red-600 hover:text-white hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-200 border border-red-200"
              >
                <Trash className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Delete</span>
              </button>
            </div>
          </div>
        </div>
        
        
        ))}
      </div>
    }
        {/* add new Offer modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          closeModalForAddOffer()
        }}
        title="Add Offer"
      >
        <form className="space-y-4 max-h-[80vh] overflow-y-auto" onSubmit={handleNewSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Name
            </label>
            <input
              type="text"
              value={newOffer.title}
              name="title"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter offer name"
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer Description
              </label>
              <textarea
                name="description"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                rows="3"
                value={newOffer.description}
                onChange={handleInputChange}
                required
              >
              </textarea>
            </div>
            {/* discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer discount
            </label>
            <input
              type="number"
              value={newOffer.discount}
              name="discount"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter discount"
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
              value={newOffer.value}
              name="value"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter offer value"
              onChange={handleInputChange}
              required
            />
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
            {isUploading ? "Uploading..." : "Add Offer"}
          </button>
        </form>
      </Modal>
        {/* edit offer modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
        }}
        title="Edit Offer"
      >
        <form className="space-y-4 max-h-[80vh] overflow-y-auto" onSubmit={handleEditSubmit}> 
          {/* title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Name
            </label>
            <input
              type="text"
              value={editOffer.title}
              name="title"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter offer name"
              onChange={handleEditInputChange}
              required
            />
          </div>
          {/* description */}
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer Description
              </label>
              <textarea
                name="description"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                rows="3"
                value={editOffer.description}
                onChange={handleEditInputChange}
                required
              >
              </textarea>
          </div>
          {/* discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer discount
            </label>
            <input
              type="number"
              value={editOffer.discount}
              name="discount"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter discount"
              onChange={handleEditInputChange}
              required
            />
          </div>
          {/* value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              type="text"
              value={editOffer.value}
              name="value"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter Offer name"
              onChange={handleEditInputChange}
              required
            />
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
            />
          </div>
          {(imageFilePreview || editOfferImage) && (
            <div className="mt-4">
              <p className="text-lg font-medium">Image Preview:</p>
              <div className="relative w-32 h-32">
                <X
                  className="text-white  bg-red-500 absolute right-1 hover:cursor-pointer hover:bg-red-400 rounded-full"
                  onClick={handleRemoveImage}
                ></X>
                <img
                  src={imageFilePreview || editOfferImage}
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
                setOfferIdToDelete(null);
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
                    onClick={handleOfferDelete}
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
