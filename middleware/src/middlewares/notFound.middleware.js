import { ApiError } from '../utils/apiError.js';

export const notFound = (req, res, next) => {
  next(ApiError.notFound(`Endpoint not found: [${req.method}] ${req.originalUrl}`));
};
