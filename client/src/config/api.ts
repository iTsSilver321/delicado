import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure this matches your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if token is invalid or expired
      localStorage.removeItem('token');
      // We don't want to force redirect here as it would interrupt the user experience
      // Instead, let the AuthContext handle the redirect on failed token validation
    }
    return Promise.reject(error);
  }
);

export default api;