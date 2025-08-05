import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import getAllBanners from "../services/homebanners/getAllBanners.js";
import Loader from "./Loader.jsx";
import scrollToPageTop from "../utils/scrollToPageTop.js";
import { useNavigate } from "react-router-dom";


function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides,setSlides]=useState([])
    const navigate=useNavigate()
    async function fetchAllBanners(){
      const {data} = await getAllBanners()
      setSlides(Array.isArray(data) ? data : [])
      //set the current slide to 0
      setCurrentSlide(0)
      scrollToPageTop()
    }
    //useEffect for getting banners
    useEffect(()=>{
      fetchAllBanners()
    },[])

    //useEffect for slider change
    useEffect(() => {
      //return if the slides array is empty or not an array
      if(!Array.isArray(slides) || slides.length===0) return 
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
  
      return () => clearInterval(timer);
    }, [slides]);//slides update then start running
    return (
        <div className="relative bg-gray-900 h-[600px] overflow-hidden">
        
      {
      !Array.isArray(slides) || slides.length===0?<Loader></Loader>:
      slides.map((slide, index) => (
        <div
          key={slide?._id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${slide?.image?.url || ''}")`,
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-white max-w-xl">
              <h1 className="text-5xl font-bold mb-6">{slide?.heading}</h1>
              <p className="text-xl mb-8">{slide?.description}</p>
              <button onClick={()=>navigate("/offers")} className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold flex items-center space-x-2 hover:bg-gray-100 transition duration-300">
                <span>Shop Now</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {Array.isArray(slides) && slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
    )
}

export default HeroSlider
