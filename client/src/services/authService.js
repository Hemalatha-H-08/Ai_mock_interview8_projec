// ============================================
// authService.js - Authentication API Calls
// ============================================
// Reference: Axios POST/GET requests - reference-javascript.md
// ============================================

import API from './api.js';

const register = async (name, email, password) => {
  try {
    console.log('Calling /auth/register with:', { name, email });
    const response = await API.post('/auth/register', { name, email, password });
    console.log('Register response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    throw error;
  }
};

const emailLogin = async (email, password) => {
  try {
    console.log('Calling /auth/login with:', { email });
    const response = await API.post('/auth/login', { email, password });
    console.log('Login response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

const getMe = async () => {
  try {
    console.log('Calling /auth/me');
    const response = await API.get('/auth/me');
    console.log('GetMe response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('GetMe error:', error.response?.data || error.message);
    throw error;
  }
};

const logout = async () => {
  try {
    const response = await API.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    throw error;
  }
};

export { register, emailLogin, getMe, logout };
