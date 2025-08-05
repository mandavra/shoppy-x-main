import { AlertTriangle, Edit, Plus, Trash, Upload } from "lucide-react";
import { useRef, useState } from "react";
import Modal from "../../common/Modal";


//..............i havnt implemented this yet..........this is dummmy..............
function AdminHomeCategories() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const categoryImageRef = useRef(null);
  const [featuredCategories, setFeaturedCategories] = useState([
    {
      id: 1,
      name: "Men",
      image:
        "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 2,
      name: "Women",
      image:
        "https://images.unsplash.com/photo-1525845859779-54d477ff291f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
  ]);
  const [categoryImagePreview, setCategoryImagePreview] = useState("");
  const handleImageChange = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCategory = {
      id: editingCategory?.id || featuredCategories.length + 1,
      name: formData.get("name"),
      image:
        categoryImagePreview ||
        editingCategory?.image ||
        "https://via.placeholder.com/400x300",
    };

    if (editingCategory) {
      setFeaturedCategories(
        featuredCategories.map((c) =>
          c.id === editingCategory.id ? newCategory : c
        )
      );
    } else {
      setFeaturedCategories([...featuredCategories, newCategory]);
    }
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCategoryImagePreview("");
  };
  const handleDelete = () => {
    if (!itemToDelete) return;

    const { type, id } = itemToDelete;
    if (type === "category") {
      setFeaturedCategories(featuredCategories.filter((c) => c.id !== id));
    }

    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const openDeleteModal = (type, id) => {
    setItemToDelete({ type, id });
    setShowDeleteModal(true);
  };
  const openCategoryModal = (category = null) => {
    setEditingCategory(category);
    setCategoryImagePreview("");
    setShowCategoryModal(true);
  };
  return (
    <>
    <section className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Featured Categories
        </h2>
        <button
          onClick={() => openCategoryModal()}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {featuredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 group"
          >
            <div className="relative h-32 bg-gray-100 overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-3">
              <h3 className="text-center font-semibold text-gray-800">
                {category.name}
              </h3>
              <div className="flex justify-center gap-2 mt-2">
                <button
                  onClick={() => openCategoryModal(category)}
                  className="p-1.5 hover:bg-indigo-100 rounded-full transition-colors duration-200 text-indigo-600"
                  aria-label="Edit category"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openDeleteModal("category", category.id)}
                  className="p-1.5 hover:bg-red-100 rounded-full transition-colors duration-200 text-red-600"
                  aria-label="Delete category"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    <Modal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategory(null);
          setCategoryImagePreview("");
        }}
        title={editingCategory ? "Edit Category" : "Add Category"}
      >
        <form className="space-y-4" onSubmit={handleCategorySubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter category name"
              defaultValue={editingCategory?.name}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Image
            </label>
            <div className="flex flex-col space-y-3">
              {(categoryImagePreview || editingCategory?.image) && (
                <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={categoryImagePreview || editingCategory?.image}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer group">
                <Upload className="w-5 h-5 mr-2 text-gray-500 group-hover:text-indigo-500 transition-colors" />
                <span>Upload Image</span>
                <input
                  ref={categoryImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImageChange(e, setCategoryImagePreview)
                  }
                />
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            {editingCategory ? "Update Category" : "Add Category"}
          </button>
        </form>
      </Modal>
      {/* delete modal */}
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
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Modal>
    </>
  );
}

export default AdminHomeCategories;
