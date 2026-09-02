import React from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen ">
      {/* Sidebar - starts below navbar (pt-20 accounts for navbar height) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 w-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
