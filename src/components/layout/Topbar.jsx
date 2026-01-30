import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Logo from "../../assets/Logo3.png";
import { NavLink, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Avatar, IconButton, useTheme } from "@mui/material";
import { ColorModeContext, CurrencyContext } from "../../context/ThemeContext";

export default function Topbar() {
  const { logout, user } = useContext(AuthContext);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { currency, toggleCurrency } = useContext(CurrencyContext);

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "U"
    );
  };

  return (
    <Disclosure
      as="nav"
      className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 sticky top-0 z-50 transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu Button (Left) */}
          <div className="flex lg:hidden">
            <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bars3Icon className="block size-6 ui-open:hidden" />
              <XMarkIcon className="hidden size-6 ui-open:block" />
            </DisclosureButton>
          </div>

          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0">
              <img
                alt="FinTrack"
                src={Logo}
                className="h-10 w-auto dark:brightness-200 dark:invert"
              />
            </Link>
          </div>

          {/* Desktop Navigation (Center-Right) */}
          <div className="hidden lg:flex lg:ml-8 lg:space-x-4 flex-1 justify-center">
            {["Dashboard", "Accounts", "Transactions", "Budgets"].map(
              (name) => (
                <NavLink
                  key={name}
                  to={`/${name.toLowerCase()}`}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium rounded-lg transition-colors 
                  ${isActive ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" : "text-gray-500 hover:text-blue-600 dark:text-gray-400"}`
                  }
                >
                  {name}
                </NavLink>
              ),
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Theme Toggle */}
            <IconButton onClick={colorMode.toggleColorMode} size="small">
              {theme.palette.mode === "dark" ? (
                <SunIcon className="size-5 text-yellow-400" />
              ) : (
                <MoonIcon className="size-5 text-gray-700" />
              )}
            </IconButton>

            {/* Currency Toggle */}
            <button
              onClick={toggleCurrency}
              className="px-2 py-1 text-[10px] sm:text-xs font-bold border rounded dark:text-white dark:border-gray-600"
            >
              {currency}
            </button>

            {/* Profile Menu */}
            <Menu as="div" className="relative ml-2">
              <MenuButton className="flex rounded-full bg-blue-500 text-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: 14,
                    bgcolor: "transparent",
                  }}
                >
                  {getInitials(user?.name)}
                </Avatar>
              </MenuButton>

              <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none border dark:border-gray-700">
                <MenuItem>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Your Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Settings
                  </Link>
                </MenuItem>
                <div className="border-t dark:border-gray-700 my-1"></div>
                <MenuItem>
                  <button
                    onClick={logout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <DisclosurePanel className="lg:hidden border-t dark:border-gray-700 bg-white dark:bg-gray-900">
        {({ close }) => (
          <div className="space-y-1 px-4 py-3">
            {[
              "Dashboard",
              "Accounts",
              "Transactions",
              "Budgets",
              // "Settings",
            ].map((name) => (
              <NavLink
                key={name}
                to={`/${name.toLowerCase()}`}
                onClick={() => close()}
                className={({ isActive }) =>
                  `block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`
                }
              >
                {name}
              </NavLink>
            ))}
          </div>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
}
