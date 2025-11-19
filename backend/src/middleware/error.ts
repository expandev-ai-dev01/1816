/**
 * @summary
 * Global error handling middleware.
 * Catches and formats errors for consistent API responses.
 *
 * @module middleware/error
 */

import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction): void {
  console.error('Error:', error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    },
    timestamp: new Date().toISOString(),
  });
}
