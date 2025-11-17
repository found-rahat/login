"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type NavItemProps = {
  href: string;
  children: ReactNode;
};

function NavItem({ href, children }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
        isActive
          ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
    >
      <span>{children}</span>
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            Dashboard
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            <li>
              <NavItem href="/dashboard">Overview</NavItem>
            </li>
            <li>
              <NavItem href="/dashboard/projects">Projects</NavItem>
            </li>
            <li>
              <NavItem href="/dashboard/users">Users</NavItem>
            </li>
            <li>
              <NavItem href="/dashboard/settings">Settings</NavItem>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                JD
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                John Doe
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                john@example.com
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="mt-4 block text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Sign out
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
