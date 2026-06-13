import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token if available
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('homehub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error messages
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      'Something went wrong. Please try again.';
    
    // We reject with a standard error object containing the message
    return Promise.reject({
      message,
      status: error.response?.status,
      originalError: error,
    });
  }
);

export default axiosClient;
