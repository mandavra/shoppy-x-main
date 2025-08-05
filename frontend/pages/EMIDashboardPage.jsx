import React from "react";
import EMIDashboard from "../components/EMIDashboard.jsx";
import AppLayout from "../components/AppLayout.jsx";

const EMIDashboardPage = () => {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">EMI Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage and track your EMI payments
          </p>
        </div>
        
        <EMIDashboard />
      </div>
    </AppLayout>
  );
};

export default EMIDashboardPage; 