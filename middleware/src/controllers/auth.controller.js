import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { setAuthCookie, clearAuthCookie } from '../utils/cookieHelper.js';
import { sanitizeDocument } from '../utils/responseTransformer.js';
import { User, USER_ROLES } from '../models/user.model.js';
import Gym from '../models/gym.model.js';

/**
 * Helper to determine expected role from body parameters
 */
const resolveExpectedRole = (body) => {
  if (body.expectedRole) return body.expectedRole;
  if (body.requiredRole) return body.requiredRole;
  if (body.portal === 'super-admin') return USER_ROLES.SUPER_ADMIN;
  if (body.portal === 'gym-owner') return USER_ROLES.GYM_OWNER;
  return null;
};

/**
 * Helper to retrieve gym associated with user
 */
const fetchUserGym = async (user) => {
  if (user.gymId) {
    return Gym.findById(user.gymId).select('-auditHistory -documents -galleryPhotos -images');
  }
  if (user.role === USER_ROLES.GYM_OWNER) {
    return Gym.findOne({ ownerId: user._id }).select('-auditHistory -documents -galleryPhotos -images');
  }
  return null;
};

/**
 * Helper to validate gym partner active state
 */
const validateGymPartnerActiveState = (gym) => {
  if (!gym) return;

  if (gym.isActive === false) {
    throw ApiError.forbidden(
      'Your gym partner account is currently deactivated. Please contact GYMEZY support.'
    );
  }
};

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

  // Enforce portal-level role authorization
  const requestedRole = resolveExpectedRole(req.body);
  if (requestedRole) {
    if (requestedRole === USER_ROLES.SUPER_ADMIN && user.role !== USER_ROLES.SUPER_ADMIN) {
      throw ApiError.forbidden('Access denied. Only Super Administrators are authorized to access the Super Admin Portal.');
    }
    if (requestedRole === USER_ROLES.GYM_OWNER && user.role !== USER_ROLES.GYM_OWNER && user.role !== USER_ROLES.SUPER_ADMIN) {
      throw ApiError.forbidden('Access denied. This portal is reserved for registered Gym Owners and Managers.');
    }
  }

  // Fetch gym profile if linked
  let gymDetails = null;
  const gym = await fetchUserGym(user);

  if (user.role !== USER_ROLES.SUPER_ADMIN) {
    validateGymPartnerActiveState(gym);
  }

  if (gym) {
    gymDetails = sanitizeDocument(gym.toJSON());
  }

  // Generate signed JWT token
  const token = user.generateAuthToken();

  // Set secure HTTP-only cookie
  setAuthCookie(res, token);

  // Return sanitized user object (strips _id, __v, password and outputs id)
  const sanitizedUser = sanitizeDocument(user.toJSON());

  return res.status(200).json(
    ApiResponse.success(
      {
        ...sanitizedUser,
        gym: gymDetails,
        token,
      },
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

  let gymDetails = null;
  const gym = await fetchUserGym(user);

  if (user.role !== USER_ROLES.SUPER_ADMIN) {
    validateGymPartnerActiveState(gym);
  }

  if (gym) {
    gymDetails = sanitizeDocument(gym.toJSON());
  }

  const sanitizedUser = sanitizeDocument(user.toJSON());

  return res.status(200).json(
    ApiResponse.success(
      {
        ...sanitizedUser,
        gym: gymDetails,
      },
      'Current user profile retrieved successfully.'
    )
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

/**
 * GET / POST /api/v1/auth/check-email
 * Check if an email is already registered across User or Gym collections
 */
export const checkEmailAvailability = asyncHandler(async (req, res) => {
  const emailParam = req.query.email || req.body.email || '';
  const email = String(emailParam).trim().toLowerCase();

  if (!email) {
    throw ApiError.badRequest('Email parameter is required.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw ApiError.badRequest('Invalid email address format.');
  }

  const [existingUser, existingGym] = await Promise.all([
    User.findOne({ email }),
    Gym.findOne({ email }),
  ]);

  const isTaken = Boolean(existingUser || existingGym);

  return res.status(200).json(
    ApiResponse.success(
      {
        email,
        isAvailable: !isTaken,
        isExisting: isTaken,
      },
      isTaken
        ? 'An account with this email address already exists.'
        : 'Email address is available.'
    )
  );
});

/**
 * POST /api/v1/auth/register
 * Customer Self-Registration Endpoint
 */
export const registerCustomer = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, gender, fitnessGoal } = req.body;

  const cleanName = (fullName || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPhone = (phone || '').trim();
  const cleanPassword = password || '';

  if (!cleanName || cleanName.length < 2) {
    throw ApiError.badRequest('Full name is required and must be at least 2 characters.');
  }

  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw ApiError.badRequest('A valid email address is required.');
  }

  if (!cleanPhone || cleanPhone.length < 7) {
    throw ApiError.badRequest('A valid phone number is required.');
  }

  if (!cleanPassword || cleanPassword.length < 6) {
    throw ApiError.badRequest('Password must be at least 6 characters long.');
  }

  // Check if user with same email or phone already exists
  const existingUser = await User.findOne({
    $or: [{ email: cleanEmail }, { phone: cleanPhone }],
  });

  if (existingUser) {
    const field = existingUser.email === cleanEmail ? 'Email address' : 'Phone number';
    throw ApiError.conflict(`${field} is already registered. Please sign in or use a different one.`);
  }

  // Create new customer user
  const newUser = await User.create({
    fullName: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    password: cleanPassword,
    role: USER_ROLES.CUSTOMER,
    gender: gender || 'PREFER_NOT_TO_SAY',
    isActive: true,
    isVerified: true,
    customerProfile: {
      fitnessGoal: fitnessGoal || 'GENERAL_FITNESS',
    },
  });

  // Generate signed JWT auth token
  const token = newUser.generateAuthToken();

  // Set secure HTTP-only cookie
  setAuthCookie(res, token);

  const sanitizedUser = sanitizeDocument(newUser.toJSON());

  return res.status(201).json(
    ApiResponse.created(
      {
        ...sanitizedUser,
        token,
      },
      `Welcome to GYMEZY, ${newUser.fullName}! Account created successfully.`
    )
  );
});


