import {
  HomeIcon,
  WalletIcon,
  ArrowsRightLeftIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Accounts",
    href: "/accounts",
    icon: WalletIcon,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: ArrowsRightLeftIcon,
  },
  {
    name: "Budgets",
    href: "/budgets",
    icon: ChartPieIcon,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 transition-all duration-300">
      {/* Optional Brand Text */}
      {/* <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <p className="text-lg font-bold tracking-tight text-blue-600">
          FinTrack
        </p>
      </div> */}

      {/* Navigation */}
      <nav className=" space-y-2 px-3 py-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `
              group flex items-center gap-3
              px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }
            `
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`
                h-5 w-5 transition-colors 
                ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }
              `}
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
