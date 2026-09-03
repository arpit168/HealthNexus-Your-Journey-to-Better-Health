import React from "react";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar - starts below navbar (pt-20 accounts for navbar height) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 w-full pb-24 lg:pb-0">{children}</main>

      <MobileBottomNav />
    </div>
  );
};

export default DashboardLayout;
