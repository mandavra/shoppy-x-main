import { Frown } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NoProductsFound({ message = "No products found!" }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6 bg-gray-100 rounded-lg shadow-md">
      <Frown className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{message}</h2>
      <p className="text-gray-600 mb-4">Try exploring other categories or checking back later.</p>
      <button
        onClick={() => navigate("/categories")}
        className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-300 shadow-md"
      >
        Browse Products
      </button>
    </div>
  );
}

export default NoProductsFound;
