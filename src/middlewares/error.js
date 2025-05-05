/**
 * Middleware xử lý lỗi không xác định được route
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
};

/**
 * Middleware xử lý lỗi tổng thể
 * @param {Error} error - Lỗi được catch
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Express next function
 */
export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
}; 