"use client";

import { useState } from "react";
import Link from "next/link";
import { authService } from "@/services/authService";
import { AuthFeatureCards, loginFeatures } from "@/components/auth/AuthFeatureCards";
import ApplicationLogo from "@/components/common/ApplicationLogo";
import InputForm from "@/components/common/InputForm";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await authService.login(email, password);

      // Redirect to dashboard or home
      window.location.href = '/dashboard';

    } catch (error) {
      const apiError = error as { message?: string; errors?: Record<string, string[]> };
      const formattedErrors = authService.formatApiError(apiError);
      setErrors(formattedErrors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Sign in to ChatX</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                create a new account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <div className="space-y-4">
              <InputForm
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                label="Email address"
                error={errors.email}
              />

              <InputForm
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                label="Password"
                error={errors.password}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Branding/Info */}
      <div className="flex-1 bg-linear-to-br from-blue-600 to-indigo-700 items-center justify-center p-8 hidden lg:flex">
        <div className="max-w-md text-center text-white">
          <ApplicationLogo />
          <h1 className="text-4xl font-bold mb-4">Welcome to ChatX</h1>
          <p className="text-xl mb-8 text-blue-100">
            Experience the future of communication with our innovative chat platform.
          </p>
          <AuthFeatureCards features={loginFeatures} />
        </div>
      </div>
    </div>
  );
}
