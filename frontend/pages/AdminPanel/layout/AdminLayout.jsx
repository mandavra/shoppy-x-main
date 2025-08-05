import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import logOutAdmin from '../../../services/admin/logOutAdmin.js';
import AdminLogin from '../tabs/AdminLogin.jsx';
import checkAdminLogin from '../../../services/admin/checkAdminLogin.js';
import { ToastContainer } from 'react-toastify';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminLoggedIn,setIsAdminLoggedIn]=useState(false)
  async function adminLogout(){
    const data = await logOutAdmin()
    if(data.data.status==="success")
      setIsAdminLoggedIn(false)
    console.log(data)
  }
  async function checkAdminAuth(){
    const {data} = await checkAdminLogin()
    if(data.status==="success")
      setIsAdminLoggedIn(true)
  }
  useEffect(()=>{
    checkAdminAuth()
  },[isAdminLoggedIn])
  return (
    <>
    {
      !isAdminLoggedIn ? <AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn}></AdminLogin>:
      <>
      <ToastContainer></ToastContainer>
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative z-50 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} onLogout={adminLogout}/>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-2 lg:p-6 mt-10 lg:ml-2">
        <Outlet />
      </main>
    </div>
      </>
    }
    </>
  );
};

export default AdminLayout;