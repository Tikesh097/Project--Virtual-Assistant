import { body, validationResult } from 'express-validator';

// ✅ Validation Error Handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// ✅ Sign Up Validation Rules
export const signUpValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  handleValidationErrors
];

// ✅ Login Validation Rules
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors
];

// ✅ Assistant Name Validation
export const assistantNameValidation = [
  body('assistantName')
    .trim()
    .notEmpty()
    .withMessage('Assistant name is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('Assistant name must be between 2 and 30 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Assistant name can only contain letters, numbers, and spaces'),

  handleValidationErrors
];

// ✅ Command Validation (for Gemini API)
export const commandValidation = [
  body('command')
    .trim()
    .notEmpty()
    .withMessage('Command is required')
    .isLength({ max: 500 })
    .withMessage('Command is too long (max 500 characters)'),

  handleValidationErrors
];
