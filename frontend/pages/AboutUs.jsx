import { useEffect } from "react"
import scrollToPageTop from "../utils/scrollToPageTop.js"

function AboutUs() {
    useEffect(()=>{
            scrollToPageTop()
          },[])
    return (
        <section className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-100">
  <div className="max-w-3xl text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-4">About This Project</h2>
    <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
      This project is proudly crafted by <span className="font-semibold text-indigo-600">Debjit Adhikari</span> as a demonstration of full-stack web development skills. It is intended for <span className="font-medium italic text-indigo-500">testing and showcasing purposes only</span> — not a commercial product.
    </p>

    <p className="text-gray-600 text-sm mb-6">
      Every section, animation, and interaction has been thoughtfully designed to reflect modern web standards and responsive design principles.
    </p>

    <a
      href="https://debjit-web.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full text-sm font-medium transition-all duration-300"
    >
      Visit My Portfolio
    </a>

    <div className="mt-10 text-sm text-gray-500">
      <p>🔧 Built with love, coffee, and lots of <span className="text-indigo-500 font-medium">Tailwind CSS</span>.</p>
      <p>📱 Fully responsive & optimized for all devices.</p>
    </div>
  </div>
</section>

    )
}

export default AboutUs
