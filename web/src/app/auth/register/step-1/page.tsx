"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthFeatureCards, registerStep1Features } from "@/components/auth/AuthFeatureCards";
import ApplicationLogo from "@/components/common/ApplicationLogo";
import InputForm from "@/components/common/InputForm";

export default function RegisterStep1() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; password_confirmation?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string; password_confirmation?: string } = {};

    if (!name) {
      newErrors.name = "Name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!passwordConfirmation) {
      newErrors.password_confirmation = "Password confirmation is required";
    } else if (password !== passwordConfirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Store user data in sessionStorage for step 2
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('registration_data', JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      }));
    }

    // Redirect to step 2
    window.location.href = '/auth/register/step-2';
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Registration Form Step 1 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Step 1: Personal Information
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
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                label="Full name"
                error={errors.name}
              />

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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                label="Password"
                error={errors.password}
              />

              <InputForm
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirm your password"
                label="Confirm password"
                error={errors.password_confirmation}
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Continue to Step 2"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Branding/Info */}
      <div className="flex-1 bg-linear-to-br from-blue-600 to-indigo-700 items-center justify-center p-8 hidden lg:flex">
        <div className="max-w-md text-center text-white">
          <ApplicationLogo />
          <h1 className="text-4xl font-bold mb-4">Step 1 of 2</h1>
          <p className="text-xl mb-8 text-blue-100">
            First, let's create your account with your personal information.
          </p>
          <AuthFeatureCards features={registerStep1Features} />
        </div>
      </div>
    </div>
  );
}
