import { ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"

function Offer({offer}) {
    return (
        <Link
              // key={offer.id}
              to={`/products?query=${offer.value}&page=1`}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                <div className="relative h-64 sm:h-80">
                  <img
                    src={offer.image.url}
                    alt={offer.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-2xl font-bold px-4 py-2 rounded-lg shadow-lg transform -rotate-12">
                    -{offer.discount}%
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    {/* <div className="text-sm text-gray-500">
                      Valid until: {offer.validUntil}
                    </div> */}
                    <div className="flex  items-center text-indigo-600 sm:font-medium group-hover:translate-x-2 transition-transform duration-300">
                      Shop Now
                      <ShoppingBag className="h-5 w-5 ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
    )
}

export default Offer