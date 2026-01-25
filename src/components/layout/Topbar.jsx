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
} from "@heroicons/react/24/outline";
import Logo from "../../assets/logo3.png";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Avatar, IconButton, useTheme } from "@mui/material";
import { ColorModeContext } from "../../context/ThemeContext";
import { CurrencyContext } from "../../context/ThemeContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Accounts", href: "/accounts", current: false },
  { name: "Transactions", href: "/transactions", current: false },
  { name: "Budgets", href: "/budgets", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Topbar() {
  const { logout, user } = useContext(AuthContext);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { currency, toggleCurrency } = useContext(CurrencyContext);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((n) => n.charAt(0).toUpperCase());
    return initials.slice(0, 2).join("");
  };

  return (
    <Disclosure
      as="nav"
      className="relative w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              {/* <span className="absolute -inset-0.5" /> */}
              {/* <span className="sr-only">Open main menu</span> */}
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div
            style={{ alignItems: "center" }}
            className="flex flex-1 items-center justify-center sm:items-stretch lg:justify-start"
          >
            <div className="flex shrink-0 items-center cursor-pointer">
              <a href="/dashboard">
                <img
                  alt="FinTrack Logo"
                  src={Logo}
                  className="h-12 w-40 transition-all duration-300 dark:brightness-200 dark:grayscale dark:invert"
                />
              </a>
            </div>
            <div className="hidden sm:ml-6 lg:block">
              <div className="px-50 flex space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    // aria-current={item.current ? "page" : undefined}
                    className={({ isActive }) =>
                      `rounded-md px-3 py-2 text-sm font-medium transition-colors
                           ${
                             isActive
                               ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                               : "text-gray-600 hover:bg-gray-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                           }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Theme toggle button */}
            <IconButton
              onClick={colorMode.toggleColorMode}
              color="inherit"
              className="mr-2"
            >
              {theme.palette.mode === "dark" ? (
                <SunIcon className="size-6 text-yellow-400" />
              ) : (
                <MoonIcon className="size-6 text-gray-800" />
              )}
            </IconButton>

            <button
              onClick={toggleCurrency}
              className="mx-2 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-xs font-bold dark:text-white"
            >
              {currency}
            </button>

            {/* Notification Button */}
            <button className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
              <BellIcon className="size-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <MenuButton className="cursor-pointer relative flex rounded-full border border-gray-200">
                {/* <img
                  alt="User"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="size-8 rounded-full"
                /> */}

                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#3b82f6",
                    fontSize: 14,
                  }}
                >
                  {getInitials(user?.name || "U")}
                </Avatar>
                <span className="sr-only">Open user menu</span>
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none 
             dark:bg-gray-800 dark:ring-white/10 dark:shadow-2xl"
              >
                <MenuItem>
                  {({ focus }) => (
                    <a
                      href="/profile"
                      className={classNames(
                        focus ? "bg-gray-100 dark:bg-gray-700" : "",
                        "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200",
                      )}
                    >
                      Your profile
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5"
                  >
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    onClick={handleLogout}
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5"
                  >
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="lg:hidden bg-white border-t dark:bg-gray-900 dark:border-gray-700">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600",
                "block rounded-md px-3 py-2 text-base font-medium",
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
