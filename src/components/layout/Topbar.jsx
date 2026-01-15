import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../../assets/logo3.png";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

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
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <Disclosure
      as="nav"
      className="relative w-full bg-white border-b border-gray-200"
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
                <img alt="FinTrack Logo" src={Logo} className="h-12 w-40" />
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
                      `
                        rounded-md px-3 py-2 text-sm font-medium transition-colors
                           ${
                             isActive
                               ? "bg-blue-50 text-blue-600"
                               : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                           }
            `
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="cursor-pointer relative rounded-full p-1 text-gray-500 hover:text-blue-600 focus:outline-none"
            >
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <MenuButton className="cursor-pointer relative flex rounded-full border border-gray-200">
                <img
                  alt="User"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="size-8 rounded-full"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5"
                  >
                    Your profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
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

      <DisclosurePanel className="lg:hidden bg-white border-gray-200 border-t ">
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
                "block rounded-md px-3 py-2 text-base font-medium"
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
