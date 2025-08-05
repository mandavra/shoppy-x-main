import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Product({ product }) {
  const navigate = useNavigate();
  const isLowStock = product.inStock <= 5;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200 overflow-hidden group"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0].url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges Container */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.discount > 0 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
              {product.discount}% OFF
            </div>
          )}
          {isLowStock && (
            <div className="bg-yellow-500 animate-pulse text-black px-2 py-1 rounded text-xs font-bold shadow-sm">
              {product.inStock} left
            </div>
          )}
        </div>
      </div>

      <div className="p-2.5 space-y-1.5">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(Number(product.rating)) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.rating})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">
            ₹{product.finalPrice}
          </span>
          {product.discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.actualPrice}
            </span>
          )}
        </div>

        <button
          className="w-full bg-gray-800 hover:bg-gray-900 text-white text-xs py-1.5 rounded-md transition-colors duration-200 shadow-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default Product;