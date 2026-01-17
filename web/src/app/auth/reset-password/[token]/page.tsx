"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/authService";
import { AuthFeatureCards, resetPasswordSuccessFeatures, resetPasswordFeatures } from "@/components/auth/AuthFeatureCards";
import ApplicationLogo from "@/components/common/ApplicationLogo";
import InputForm from "@/components/common/InputForm";

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const token = params.token as string | undefined
  const email = searchParams.get('email')

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; password_confirmation?: string; general?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      router.push("/auth/login");
    }
    console.log('token', token)
    console.log('email', email)
  }, [token, email, router]);

  const validateForm = () => {
    const newErrors: { password?: string; password_confirmation?: string } = {};

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

    setIsLoading(true);
    setErrors({});

    try {
      await authService.resetPassword(token!, email!, password, passwordConfirmation);
      setIsSuccess(true);
    } catch (error) {
      const apiError = error as { message?: string; errors?: Record<string, string[]> };
      const formattedErrors = authService.formatApiError(apiError);
      setErrors(formattedErrors);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex bg-white">
        {/* Left Side - Success Content */}
        <div className="flex-1 flex items-center justify-center ">
          <div className="max-w-lg w-full">
            <div className="text-center space-y-8">
              {/* Success Icon */}
              <div className="relative inline-flex">
                <div className="w-20 h-20 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-linear-to-br from-green-400 to-green-600 rounded-full blur opacity-25"></div>
              </div>

              {/* Success Message */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Password Reset
                  <span className="block text-green-600">Successful!</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Your password has been successfully reset. You can now sign in with your new password and continue using ChatX.
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
                >
                  Sign in to your account
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Updated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Branding/Info */}
        <div className="flex-1 bg-linear-to-br from-blue-600 to-indigo-700 items-center justify-center hidden lg:flex">
          <div className=" text-center text-white">
            <ApplicationLogo />
            <h1 className="text-4xl font-bold mb-4">Password Reset</h1>
            <p className="text-xl mb-8 text-blue-100">
              Your password has been successfully updated. Welcome back to ChatX!
            </p>
            <AuthFeatureCards features={resetPasswordSuccessFeatures} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Reset Password Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below to reset your account password.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <InputForm
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              label="New Password"
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
              placeholder="Confirm new password"
              label="Confirm Password"
              error={errors.password_confirmation}
            />

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
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
          <h1 className="text-4xl font-bold mb-4">Reset Password</h1>
          <p className="text-xl mb-8 text-blue-100">
            Create a new secure password for your ChatX account.
          </p>
          <AuthFeatureCards features={resetPasswordFeatures} />
        </div>
      </div>
    </div>
  );
}