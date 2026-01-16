"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authService } from "@/services/authService";
import { AuthFeatureCards, registerStep2Features } from "@/components/auth/AuthFeatureCards";
import ApplicationLogo from "@/components/common/ApplicationLogo";
import InputForm from "@/components/common/InputForm";
import TextAreaForm from "@/components/common/TextAreaForm";

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function RegisterStep2() {
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [appDomain, setAppDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ app_name?: string; app_description?: string; app_domain?: string; general?: string }>({});
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);

  useEffect(() => {
    // Retrieve registration data from sessionStorage
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem('registration_data');
      if (data) {
        setRegistrationData(JSON.parse(data));
      } else {
        // Redirect to step 1 if no data found
        window.location.href = '/auth/register/step-1';
      }
    }
  }, []);

  const validateForm = () => {
    const newErrors: { app_name?: string; app_description?: string; app_domain?: string } = {};

    if (!appName) {
      newErrors.app_name = "App name is required";
    } else if (appName.length < 2) {
      newErrors.app_name = "App name must be at least 2 characters";
    } else if (appName.length > 255) {
      newErrors.app_name = "App name must not exceed 255 characters";
    }

    if (appDescription && appDescription.length > 1000) {
      newErrors.app_description = "App description must not exceed 1000 characters";
    }

    if (appDomain && appDomain.length > 255) {
      newErrors.app_domain = "App domain must not exceed 255 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !registrationData) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await authService.register(
        registrationData.name,
        registrationData.email,
        registrationData.password,
        registrationData.password_confirmation,
        appName,
        appDescription,
        appDomain
      );

      // Clear sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('registration_data');
      }

      // Redirect to dashboard
      window.location.href = '/dashboard';

    } catch (error) {
      const apiError = error as { message?: string; errors?: Record<string, string[]> };
      const formattedErrors = authService.formatApiError(apiError);
      setErrors(formattedErrors);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    // Clear sessionStorage and go back to step 1
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('registration_data');
    }
    window.location.href = '/auth/register/step-1';
  };

  if (!registrationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Registration Form Step 2 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Create your application</h2>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Step 2: Application Details
            </p>
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>Account:</strong> {registrationData.name} ({registrationData.email})
              </p>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <div className="space-y-4">
              <InputForm
                id="app_name"
                name="app_name"
                type="text"
                required
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="My Awesome App"
                label="Application Name *"
                error={errors.app_name}
              />

              <InputForm
                id="app_domain"
                name="app_domain"
                type="text"
                value={appDomain}
                onChange={(e) => setAppDomain(e.target.value)}
                placeholder="myapp.example.com (optional)"
                label="Application Domain"
                error={errors.app_domain}
              />

              <TextAreaForm
                id="app_description"
                name="app_description"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                placeholder="Describe your application (optional)"
                label="Application Description"
                error={errors.app_description}
                rows={4}
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Branding/Info */}
      <div className="flex-1 bg-linear-to-br from-blue-600 to-indigo-700 items-center justify-center p-8 hidden lg:flex">
        <div className="max-w-md text-center text-white">
          <ApplicationLogo />
          <h1 className="text-4xl font-bold mb-4">Step 2 of 2</h1>
          <p className="text-xl mb-8 text-blue-100">
            Now let's set up your application details to complete your registration.
          </p>
          <AuthFeatureCards features={registerStep2Features} />

          <div className="mt-8 p-4 bg-white/10 rounded-lg">
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-100 space-y-2">
              <li>• Your account will be created</li>
              <li>• Your application will be set up</li>
              <li>• You'll be redirected to your dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
