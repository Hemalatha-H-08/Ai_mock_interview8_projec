// ============================================
// api.js - Axios Instance with Auth Interceptor
// ============================================
// Creates a reusable Axios instance that auto-attaches
// the JWT token to every request.
// Reference: axios.create(), interceptors - reference-javascript.md
// ============================================

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('Initializing Axios with API_URL:', API_URL);

const API = axios.create({
  baseURL: API_URL,
  timeout: 120000,
});

// Request interceptor - attach JWT token and handle FormData
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Don't override Content-Type for FormData - let browser set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  console.log(`[${config.method.toUpperCase()}] ${config.url}`, { hasToken: !!token, isFormData: config.data instanceof FormData });
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Response interceptor - handle errors standardly
API.interceptors.response.use(
  (response) => {
    console.log(`Response [${response.status}]:`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error(`API Error [${error.response.status}]:`, error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timed out:', error.message);
      error.message = 'Request timed out. The server may be busy or the request took too long. Please try again.';
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error: No response from server', error.request);
      error.message = 'Network Error: Unable to connect to server. Make sure the server is running at ' + API_URL;
    } else {
      // Error in request setup
      console.error('Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default API;
