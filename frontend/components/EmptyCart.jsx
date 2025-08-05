import { ShoppingCart, PackagePlus } from 'lucide-react';

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10 px-4 sm:px-6">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
        <ShoppingCart className="w-10 h-10 text-gray-400" />
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Cart is Empty</h2>

      <p className="text-gray-600 text-center mb-6">
        Looks like you haven't added anything to your cart yet.
        <br />
        Explore our products and find something you love!
      </p>

      <div className="flex items-center justify-center space-x-4">
        <PackagePlus className="w-5 h-5 text-blue-500" />
        <a href="/" className="text-blue-600 font-medium hover:underline">
          Start Shopping
        </a>
      </div>
    </div>
  );
}

export default EmptyCart;