import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper for auto-logout and redirect
const handleLogout = () => {
  Cookies.remove('token');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Helper to determine user-friendly message
const getFriendlyErrorMessage = (error: AxiosError): string => {
  if (!navigator.onLine) {
    return 'You are currently offline. Please check your internet connection.';
  }

  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please try again later.';
  }

  if (!error.response) {
    return 'A network error occurred. Please check your connection and try again.';
  }

  const status = error.response.status;

  if (status === 401) {
    return 'Your session has expired. Redirecting to login...';
  }

  if (status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (status === 404) {
    return 'The requested resource was not found.';
  }

  if (status >= 500) {
    return 'An unexpected server error occurred. Please try again later.';
  }

  // Safe fallback to avoid showing raw stack traces or DB errors
  return 'Something went wrong. Please try again.';
};

// Response Interceptor: Retries & Centralized Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as CustomAxiosRequestConfig;
    
    // 1. Check for 401 Unauthorized -> Logout and Redirect
    if (error.response?.status === 401) {
      handleLogout();
      return Promise.reject(new Error(getFriendlyErrorMessage(error)));
    }

    // 2. Check for 5xx Server Errors -> Retry 3x with Exponential Backoff
    const status = error.response?.status;
    const isServerError = status && status >= 500 && status < 600;
    const isNetworkError = !error.response;

    if ((isServerError || isNetworkError) && config) {
      config._retryCount = config._retryCount ?? 0;

      if (config._retryCount < 3) {
        config._retryCount += 1;
        
        // Exponential backoff delay: 1s, 2s, 4s
        const backoffDelay = Math.pow(2, config._retryCount) * 1000;
        
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        
        return apiClient(config);
      }
    }

    // 3. Normalize to a user-safe error message
    const friendlyMessage = getFriendlyErrorMessage(error);
    const normalizedError = new Error(friendlyMessage);
    Object.defineProperty(normalizedError, 'originalError', { value: error, enumerable: false });

    return Promise.reject(normalizedError);
  }
);
