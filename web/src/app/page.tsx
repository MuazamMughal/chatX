"use client";

import { useEffect } from "react";
import { authService } from "@/services/authService";

export default function Home() {
  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (authService.isAuthenticated()) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/auth/login";
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
