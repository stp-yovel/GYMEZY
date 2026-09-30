import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { setAuthCookie, clearAuthCookie } from '../utils/cookieHelper.js';
import { sanitizeDocument } from '../utils/responseTransformer.js';
import { User } from '../models/user.model.js';

/**
 * Unified Login Controller for all platform roles
 * Supports authentication via Email or Phone with Password
 * Sets secure HTTP-only JWT cookie
 */
export const login = asyncHandler(async (req, res) => {
  const { identifier, email, phone, password } = req.body;

  const loginIdentifier = (identifier || email || phone || '').trim();

  if (!loginIdentifier || !password) {
    throw ApiError.badRequest('Email/Phone and password are required.');
  }

  // Determine if identifier is email or phone
  const isEmail = loginIdentifier.includes('@');
  const query = isEmail
    ? { email: loginIdentifier.toLowerCase() }
    : { phone: loginIdentifier };

  // Fetch user including hidden password field
  const user = await User.findOne(query).select('+password');

  if (!user) {
    // Constant message to prevent account enumeration
    throw ApiError.unauthorized('Invalid credentials. Please verify your email/phone and password.');
  }

  // Check if account is active
  if (!user.isActive) {
    throw ApiError.forbidden('Your account is inactive or disabled. Please contact GYMEZY support.');
  }

  // Verify password using bcrypt comparison
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid credentials. Please verify your email/phone and password.');
  }

  // Generate signed JWT token
  const token = user.generateAuthToken();

  // Set secure HTTP-only cookie
  setAuthCookie(res, token);

  // Return sanitized user object (strips _id, __v, password and outputs id)
  const sanitizedUser = sanitizeDocument(user.toJSON());

  return res.status(200).json(
    ApiResponse.success(
      sanitizedUser,
      `Welcome back, ${user.fullName}! Login successful.`
    )
  );
});

/**
 * Get currently authenticated user details
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw ApiError.unauthorized('Authentication session is invalid.');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.notFound('User account not found.');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Account has been deactivated.');
  }

  const sanitizedUser = sanitizeDocument(user.toJSON());

  return res.status(200).json(
    ApiResponse.success(sanitizedUser, 'Current user profile retrieved successfully.')
  );
});

/**
 * Log out user and clear HTTP-only auth cookie
 */
export const logoutUser = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  return res.status(200).json(
    ApiResponse.success(null, 'User logged out successfully. Auth cookie cleared.')
  );
});
