import { Link } from "react-router-dom"
import scrollToPageTop from "../utils/scrollToPageTop.js"
import { useEffect } from "react"

function NoRoute() {
    useEffect(()=>{
        scrollToPageTop()
      },[])
    return (
        <div className="min-h-[60vh] bg-gray-100 flex flex-col justify-center items-center px-6 py-2 text-center">
      {/* <h1 className="text-7xl sm:text-8xl font-extrabold text-indigo-600 mb-4">404</h1> */}

      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
        This route doesn't exist
      </h2>

      <p className="text-gray-600 max-w-md mb-6">
  Looks like you've stumbled onto a route that hasn’t been implemented yet.
  This is a test project created by <span className="font-medium text-indigo-700">Debjit Adhikari</span> to showcase full-stack web development skills.
</p>


      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-full transition"
        >
          Return Home
        </Link>
        <Link
          to="/about"
          className="border border-indigo-600 hover:bg-indigo-600 hover:text-white text-indigo-600 font-medium py-3 px-6 rounded-full transition"
        >
          About This Project
        </Link>
      </div>

      <p className="mt-10 text-sm text-gray-500">
        View my portfolio:{" "}
        <a
          href="https://debjit-web.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline font-medium"
        >
          Click Here
        </a>
      </p>
    </div>
    )
}

export default NoRoute
