import React, { useState, useRef, useEffect } from "react";
import { Plus, Edit, Trash, Upload, AlertTriangle } from "lucide-react";
import HomeAdminBanners from "./adminComponents/HomeAdminBanners.jsx";

const HomeTab = () => {
  return (
    <div className="space-y-10 p-2 sm:p-6 bg-gray-50">
      {/* Hero Banners Section */}
      <HomeAdminBanners></HomeAdminBanners>
    </div>
  );
};

export default HomeTab;
