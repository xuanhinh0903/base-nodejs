// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/crypto.js';

/**
 * Middleware to authenticate JWT token
 * Extracts token from Authorization header and verifies it
 * Adds user information to request object if token is valid
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Required',
        message:
          'Access token is required. Please provide token in Authorization header.',
      });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          error: 'Token Verification Failed',
          message: 'Token verification failed.',
        });
      }

      // Add user information to request object
      req.user = decoded;
      next();
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: 'Authentication Error',
      message: 'An error occurred during authentication.',
    });
  }
};

/**
 * Optional authentication middleware
 * Similar to authenticateToken but doesn't return error if no token
 * Useful for routes that can work with or without authentication
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (!err) {
          req.user = decoded;
        }
        next();
      });
    } else {
      next();
    }
  } catch {
    next();
  }
};

/**
 * Role-based authorization middleware
 * Checks if user has required role to access the resource
 */
export const requireRole = requiredRole => {
  return (req, res, next) => {
    // First authenticate the token
    authenticateToken(req, res, err => {
      if (err) return;

      // Check if user has required role
      if (req.user.role !== requiredRole) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient Permissions',
          message: `Access denied. Required role: ${requiredRole}`,
        });
      }

      next();
    });
  };
};
