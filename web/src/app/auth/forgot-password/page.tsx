"use client";

import { useState } from "react";
import Link from "next/link";
import { authService } from "@/services/authService";
import { AuthFeatureCards, forgotPasswordFeatures } from "@/components/auth/AuthFeatureCards";
import ApplicationLogo from "@/components/common/ApplicationLogo";
import InputForm from "@/components/common/InputForm";

interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
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
    setRateLimited(false);

    try {
      await authService.sendPasswordResetLink(email);
      setIsSubmitted(true);
    } catch (error) {
      const apiError = error as ApiError;
      const formattedErrors = authService.formatApiError(apiError);

      // Check if it's a rate limiting error
      if (apiError.message?.includes('Please wait before retrying')) {
        setRateLimited(true);
        setErrors({ general: 'Too many requests. Please wait before trying again.' });
      } else {
        setErrors(formattedErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex bg-linear-to-br from-slate-50 to-blue-50">
        {/* Left Side - Success Message */}
        <div className="flex-1 flex items-center justify-center ">
          <div className="max-w-md w-full">
            <div className="">
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Check Your Email</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  We've sent a password reset link to <strong className="text-blue-600">{email}</strong>.
                  Please check your inbox and follow the instructions to reset your password.
                </p>

                <div className="mb-8">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-blue-900 mb-4">What happens next?</h3>
                    <ul className="text-sm text-blue-800 space-y-3">
                      <li className="flex items-start">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 shrink-0">1</span>
                        <span>Check your email inbox</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 shrink-0">2</span>
                        <span>Click the password reset link in the email</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 shrink-0">3</span>
                        <span>Create a new password</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 shrink-0">4</span>
                        <span>Return to login with your new password</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Link
                  href="/auth/login"
                  className="flex items-center font-medium text-blue-600 hover:text-blue-500"
                >
                  Back to Sign In
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Branding/Visual */}
        <div className="flex-1 relative overflow-hidden hidden lg:flex">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-indigo-600">
          </div>

          <div className="relative z-10 flex items-center justify-center p-12">
            <div className="text-center text-white">
              <div className="">
                <ApplicationLogo />
              </div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Email Sent!

              </h1>
              <p className="text-xl mb-12 text-blue-100 leading-relaxed">
                Your password reset link is on its way. Follow the instructions in the email to secure your account.
              </p>

              <AuthFeatureCards features={forgotPasswordFeatures} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Forgot your password?</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {rateLimited && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58-9.92c.75-1.334 2.722-1.334 3.486 0l5.58 9.92c.75 1.334 2.722 1.334 3.486 0zM6 18a1 1 0 001 1h2a1 1 0 100-2 0H6z" clipRule="evenodd" />
                  </svg>
                  <span>
                    <strong>Rate Limited:</strong> Too many requests. Please wait a few minutes before trying again.
                  </span>
                </div>
              </div>
            )}

            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

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

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
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
          <h1 className="text-4xl font-bold mb-4">Forgot Password?</h1>
          <p className="text-xl mb-8 text-blue-100">
            No worries, we'll help you reset your password and get back to your account.
          </p>
          <AuthFeatureCards features={forgotPasswordFeatures} />
        </div>
      </div>
    </div>
  );
}
