"use client";

import { useEffect } from "react";

export default function RegisterPage() {
  useEffect(() => {
    // Redirect to step 1 of registration
    window.location.href = '/auth/register/step-1';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to registration...</p>
      </div>
    </div>
  );
}
