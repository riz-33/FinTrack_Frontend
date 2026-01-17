import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Topbar toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:flex h-full">
          <Sidebar isCollapsed={isCollapsed} />
        </div>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
