import { ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

function Category({category}) {
  
    return (
        <Link
            key={category._id}
            to={`/categories/${category.value}?page=1`}
            className="group"
          >
            <div className="relative h-80 rounded-xl overflow-hidden">
              <img
                src={category.image.url}
                alt={category.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 group-hover:from-black/80 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-end p-6">
                <div className="w-full">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                  <div className="flex items-center justify-between">
                    {/* <span className="text-white/80">{category.itemCount} items</span> */}
                    <span className="flex items-center text-white group-hover:translate-x-2 transition-transform duration-300">
                      <span className="mr-2">Shop Now</span>
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
    )
}

export default Category
