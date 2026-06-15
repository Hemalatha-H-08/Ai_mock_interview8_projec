// ============================================
// auth.controller.js - Auth Controller
// ============================================
// Handles HTTP requests for authentication.
// Flow: Route → Controller → Service → Database
// Reference: req.body, res.json(), res.status() - reference-backend.md
// ============================================

import * as authService from '../services/auth.service.js';

/**
 * POST /api/auth/register
 * Register with email and password.
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('[Auth] Register attempt:', { name, email });

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const result = await authService.register(name, email, password);
    console.log('[Auth] Register successful:', { email });
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('[Auth] Register error:', error.message);
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Login with email and password.
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    console.log('[Auth] Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const result = await authService.emailLogin(email, password);
    console.log('[Auth] Login successful:', { email });
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('[Auth] Login error:', error.message);
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Get the current logged-in user's profile.
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user._id);
    return res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Logout user (frontend deletes the token).
 */
export const logout = (req, res) => {
  return res.json({ success: true, data: { message: 'Logged out successfully' } });
};
