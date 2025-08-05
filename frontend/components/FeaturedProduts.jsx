import { ArrowRight, Star } from "lucide-react";
import { useEffect,useState } from "react";
import Loader from "./Loader.jsx";
import getAllFeaturedProductsService from "../services/products/getAllFeaturedProductsService.js";
import Product from "./Product.jsx";

function FeaturedProduts() {
    const [products,setProducts]=useState([])
    const [isProductLoading,setIsProductLoading]=useState(true)
    async function fetchAllProducts(){
      
      const {data} = await getAllFeaturedProductsService()
      // console.log(data)
      setProducts(Array.isArray(data) ? data : [])
      setIsProductLoading(false)
    }
    useEffect(()=>{
      fetchAllProducts()
    },[])
    return (
        <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="sm:text-3xl text-xl font-bold text-gray-900 mb-8">Featured Products</h2>
        {
          isProductLoading?<Loader></Loader>:
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {
          Array.isArray(products) && products.map((product) => (
            <Product key={product._id} product={product}></Product>
          ))}
        </div>
        }
      </div>
        </section>
    )
}

export default FeaturedProduts
