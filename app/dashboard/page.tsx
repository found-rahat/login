"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated by verifying the token
    const token = localStorage.getItem("auth_token");

    if (!token) {
      // No token, redirect to login
      router.push("/login");
      return;
    }

    // Decode the JWT to get user info
    try {
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        setUser(payload);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error decoding token:", error);
      // If there's an error decoding the token, redirect to login
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    // Remove the token cookie and redirect to login
    Cookies.remove("auth_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Welcome, {user?.email || "User"}!
            </span>
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Profile
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Complete
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="shrink-0 bg-green-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Status
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Active
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="shrink-0 bg-blue-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Joined
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">Today</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Content */}
        <div className="mt-8 bg-white overflow-hidden shadow sm:rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Welcome to Your Dashboard
          </h2>
          <p className="text-gray-600">
            This is your personalized dashboard. Here you can manage your
            account, view your data, and access all the features of our
            application.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Recent Activity
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Logged in to your account</span>
                  <span className="text-gray-500 text-sm">Just now</span>
                </li>
                <li className="flex justify-between">
                  <span>Updated profile information</span>
                  <span className="text-gray-500 text-sm">2 hours ago</span>
                </li>
                <li className="flex justify-between">
                  <span>Changed password</span>
                  <span className="text-gray-500 text-sm">Yesterday</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                  View Profile
                </button>
                <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-300">
                  Update Settings
                </button>
                <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-300">
                  Manage Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
