"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code" | "password" | "success">(
    "email"
  ); // Added step state
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(3); // Countdown state
  const router = useRouter();

  // Handle redirect after successful password reset
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (step === "success") {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
      } else {
        // Redirect after countdown reaches 0
        setTimeout(() => {
          router.push("/login");
        }, 500);
      }
    } else {
      // Reset countdown when not on success step
      setCountdown(3);
    }

    // Cleanup timer when component unmounts or dependencies change
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [step, countdown, router]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep("code"); // Move to code input step
        setSuccessMessage(
          "A 6-digit code has been sent to your email. Please check your inbox."
        );
      } else {
        setError(data.error || "Failed to send password reset code");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!code) {
      setError("Code is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/verify-reset-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // If code is valid, move to password step and clear the success message
        setStep("password");
        setSuccessMessage("");
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (err) {
      console.error("Code verification error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!code || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep("success");
        setError(null);

        // Clear form fields
        setCode("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-indigo-600">FP</span>
          </div>
          <h2 className="mt-6 text-3xl text-gray-900">
            {step === "email" && "Forgot your password?"}
            {step === "code" && "Enter Verification Code"}
            {step === "password" && "Reset Your Password"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === "email" &&
              "No worries! Enter your email and we'll send you a 6-digit code to reset your password."}
            {step === "code" && "Enter the 6-digit code sent to your email."}
            {step === "password" &&
              "Your code has been verified. Enter your new password and confirm it."}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {successMessage && step === "code" && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {/* Step 1: Enter Email */}
        {step === "email" && (
          <form className="mt-8 space-y-6" onSubmit={handleSendCode}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending reset code..." : "Send Reset Code"}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600 mt-6">
              <p>
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* Step 2: Enter Verification Code */}
        {step === "code" && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyCode}>
            <div>
              <label
                htmlFor="email-display"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email-display"
                name="email-display"
                type="email"
                value={email}
                disabled
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                Verification Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={6}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter 6-digit code"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="flex-1 py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600 mt-6">
              <p>
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={loading}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Resend code
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Step 3: Enter New Password */}
        {step === "password" && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label
                htmlFor="email-display-password"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email-display-password"
                name="email-display-password"
                type="email"
                value={email}
                disabled
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("code")}
                className="flex-1 py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Success Message */}
        {step === "success" && (
          <div className="mt-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Changed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your password has been updated successfully. You will be
              redirected to the login page shortly.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting to login in <span>{countdown}</span> seconds...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
