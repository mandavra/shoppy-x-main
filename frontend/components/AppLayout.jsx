import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"

function AppLayout() {
    const location = useLocation()
    const isAdminRoute = location.pathname.startsWith("/admin")
    return (
        <div className="bg-gray-100">
            {!isAdminRoute && <Navbar></Navbar>}
            <Outlet></Outlet>
            {!isAdminRoute && <Footer></Footer>}
        </div>
    )
}

export default AppLayout
