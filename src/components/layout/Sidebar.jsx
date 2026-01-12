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
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-white/10">
      {/* Optional Brand Text */}
      <div className="px-4 py-4 border-b border-white/10">
        <p className="text-sm font-semibold tracking-wide text-gray-400">
          FinTrack
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-4 space-y-1 px-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `
              group flex items-center gap-3
              px-3 py-2 rounded-md text-sm font-medium
              ${
                isActive
                  ? "bg-blue-600/15 text-white border-l-2 border-blue-500"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }
            `
            }
          >
            <item.icon
              className={`
                h-5 w-5
                ${
                  window.location.pathname === item.href
                    ? "text-blue-400"
                    : "text-gray-400 group-hover:text-white"
                }
              `}
            />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
