const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend.local/api';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterResponse {
  user: User;
  app: any;
  access_token: string;
  token_type: string;
}

export interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}

class AuthService {
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data as ApiError;
    }

    // Store token and user data
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  }

  async register(name: string, email: string, password: string, password_confirmation: string, app_name?: string, app_description?: string, app_domain?: string): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation,
        app_name: app_name || '',
        app_description: app_description || null,
        app_domain: app_domain || null
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data as ApiError;
    }

    // Store token and user data
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.app) {
        localStorage.setItem('app', JSON.stringify(data.app));
      }
    }

    return data;
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const data = await response.json();
      throw data as ApiError;
    }

    // Clear stored data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('app');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data as ApiError;
    }

    return data;
  }

  async updateProfile(userData: Partial<{ name: string; email: string; password: string; password_confirmation: string }>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data as ApiError;
    }

    // Update stored user data
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
  }

  async refreshToken(): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data as ApiError;
    }

    // Update stored token
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  }

  async deleteAccount(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/account`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const data = await response.json();
      throw data as ApiError;
    }

    // Clear stored data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  }

  async sendPasswordResetLink(email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/password/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw data as ApiError;
    }
  }

  async resetPassword(token: string, email: string, password: string, passwordConfirmation: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/password/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw data as ApiError;
    }
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('access_token');
    }
    return false;
  }

  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  getStoredApp(): any | null {
    if (typeof window !== 'undefined') {
      const appData = localStorage.getItem('app');
      return appData ? JSON.parse(appData) : null;
    }
    return null;
  }

  // Helper method to handle API errors consistently
  formatApiError(error: ApiError): Record<string, string> {
    return AuthService.formatApiError(error);
  }

  // Static method to handle API errors consistently
  static formatApiError(error: ApiError): Record<string, string> {
    const formattedErrors: Record<string, string> = {};

    if (error.errors) {
      // Laravel validation errors come as { field: [error1, error2, ...] }
      Object.entries(error.errors).forEach(([field, messages]) => {
        formattedErrors[field] = Array.isArray(messages) ? messages[0] : messages;
      });
    }

    if (error.message && !formattedErrors.general) {
      formattedErrors.general = error.message;
    }

    return formattedErrors;
  }
}

export const authService = new AuthService();
