import { useEffect } from "react"
import scrollToPageTop from "../utils/scrollToPageTop"

function SocialMediaPage() {
    useEffect(()=>{
    scrollToPageTop()
  },[])
    return (
        <div className="lg:col-span-1 min-h-[60vh] mt-10 px-4">
  {/* Social Media Section */}
  <h4 className="text-center text-base font-semibold text-indigo-700 mb-2 tracking-wide">
    Stay Connected
  </h4>
  <p className="text-center text-sm text-gray-600 mb-6">
    This is a testing project made to showcase my skills — social links are non-functional. 
  </p>

  
  <p className="text-center text-sm text-gray-500 mt-6 italic">
    No need to wait — dive in and explore what's already working! 😉
  </p>
</div>

    )
}

export default SocialMediaPage
