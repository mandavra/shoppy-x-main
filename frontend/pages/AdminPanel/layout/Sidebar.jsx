import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, ShoppingBag, Package, Tag, FileText, Mail, X, LogOut, Disc3Icon, Ticket, Currency, IndianRupee, BadgeIndianRupeeIcon } from "lucide-react";

const navItems = [
  { path: "/admin", icon: Home, label: "Home" },
  { path: "categories", icon: ShoppingBag, label: "Categories" },
  { path: "products", icon: Package, label: "Products" },
  { path: "offers", icon: Tag, label: "Offers" },
  { path: "coupons", icon: Ticket, label: "Coupons" },
  { path: "orders", icon: FileText, label: "Orders" },
  { path: "contact", icon: Mail, label: "Contact" },
  { path: "currency", icon: BadgeIndianRupeeIcon, label: "Currency Rate" },
];

const Sidebar = ({ onClose,onLogout }) => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white shadow-xl h-screen flex flex-col border-r border-gray-200">
      {/* Logo & Close Button */}
      <div className="p-6 flex items-center justify-between border-b border-gray-300">
        <img
          src="/images/logo-shop.jpeg"
          width="130px"
          onClick={() => navigate("/")}
          alt="logo"
          className="hover:cursor-pointer transition-transform duration-300 hover:scale-105"
        />
        <button onClick={onClose} className="lg:hidden text-gray-600 hover:text-gray-800">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-col gap-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path==="/admin"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg text-gray-700 transition duration-200 hover:bg-gray-100 hover:text-blue-600 ${
                isActive ? "bg-blue-100 text-blue-600 font-semibold" : ""
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto p-4">
        <button onClick={onLogout} className="w-full flex items-center px-4 py-3 rounded-lg bg-red-500 text-white transition duration-200 hover:bg-red-600">
          <LogOut className="w-5 h-5 mr-3" /> Logout
        </button>
        
      </div>
    </aside>
  );
};

export default Sidebar;