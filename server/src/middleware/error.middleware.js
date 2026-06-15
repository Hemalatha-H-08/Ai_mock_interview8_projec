// ============================================
// error.middleware.js - Global Error Handling
// ============================================
// Catches errors from anywhere in the app and
// sends a clean error response to the client.
//
// Express 5.x automatically catches async errors,
// so we don't need express-async-errors!
// Reference: Error handling middleware - reference-backend.md
// ============================================

/**
 * 404 Handler - When a route doesn't exist.
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Global Error Handler - Catches all unhandled errors.
 * Express knows this is an error handler because
 * it has 4 parameters: (err, req, res, next)
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Something went wrong on the server.';
  
  console.error(`[${req.method} ${req.originalUrl}] Error (${statusCode}):`, {
    message,
    statusCode,
    stack: err.stack
  });

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { error: err.toString() })
  });
};
