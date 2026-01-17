import { motion, AnimatePresence } from "framer-motion";
import { 
  HomeIcon, WalletIcon, ArrowsRightLeftIcon, 
  ChartPieIcon, PlusCircleIcon 
} from "@heroicons/react/24/outline";
import { NavLink, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { 
    name: "Accounts", 
    href: "/accounts", 
    icon: WalletIcon,
    children: [{ name: "New Account", href: "/accounts/add" }]
  },
  { 
    name: "Transactions", 
    href: "/transactions", 
    icon: ArrowsRightLeftIcon,
    children: [{ name: "New Transaction", href: "/transactions/add" }]
  },
  { 
    name: "Budgets", 
    href: "/budgets", 
    icon: ChartPieIcon,
    children: [{ name: "Set Budget", href: "/budgets/add" }]
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-100 dark:bg-gray-900 dark:border-gray-800 transition-colors">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          // A section is "Active" if we are on that page OR any of its children
          const isActive = pathname.startsWith(item.href);

          return (
            <div key={item.name} className="space-y-1">
              {/* Main Category Link */}
              <NavLink
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none" 
                    : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400"
                  }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                {item.name}
              </NavLink>

              {/* Contextual Sub-Menu: Only shows if the Parent is active */}
              <AnimatePresence>
                {isActive && item.children && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-4 pl-6 border-l-2 border-gray-100 dark:border-gray-800 space-y-1"
                  >
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        to={child.href}
                        className={({ isActive: isSubActive }) => 
                          `flex items-center gap-2 py-2 text-xs font-medium transition-colors
                          ${isSubActive 
                            ? "text-blue-600 dark:text-blue-400" 
                            : "text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`
                        }
                      >
                        <PlusCircleIcon className="h-3.5 w-3.5" />
                        {child.name}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}