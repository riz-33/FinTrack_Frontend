import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    // 1. Full screen container, stacked vertically
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50">
      
      {/* 2. Topbar sits at the very top, full width */}
      <Topbar toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

      {/* 3. Bottom section: Sidebar and Main Content side-by-side */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR: Hidden on mobile (lg:flex), width changes based on collapse */}
        <div className="hidden lg:flex h-full">
          <Sidebar isCollapsed={isCollapsed} />
        </div>

        {/* MAIN CONTENT: Scrollable area for pages */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;