const { body, validationResult } = require('express-validator')
const userValidationRules = () => {
  return [
    body('username').isString().isLength({ min: 3, max: 5 }).withMessage('Lastname must be between 3 and 5 characters.'),
    body('email').isEmail().withMessage('Email must be a valid email address.'),
    body('password').custom((value, { req }) => {
      if (req.body.authType === 'local' && !value) {
        throw new Error('Password is required for local authentication');
      }
      return true; // if there's no error, return true
    })
      .isLength({ min: 3 }).withMessage('Password must be at least 3 characters long.'),
    body('birthday').isISO8601().withMessage('Birthday must be in format YYYY-MM-DD'),
    body('authType').isIn(['local', 'oauth']).withMessage('authType must be either "local" or "oauth"'),
  ]
}
const userUpdateValidationRules = () => {
    return [
      body('username').custom((value, { req }) => {
          if (req.body.authType === 'oauth') {
            throw new Error('You cannot change username');
          }
          return true; // if there's no error, return true
        })
        .optional().isString().isLength({ min: 3, max: 5 }).withMessage('Lastname must be between 3 and 5 characters.'),
      body('email').custom((value, { req }) => {
          if (req.body.authType === 'oauth') {
            throw new Error('You cannot change email');
          }
          return true; // if there's no error, return true
        })
        .optional().isEmail().withMessage('Email must be a valid email address.'),
      body('password').custom((value, { req }) => {
          if (req.body.authType === 'oauth') {
            throw new Error('You cannot change password');
          }
          return true; // if there's no error, return true
        })
        .optional().isLength({ min: 3 }).withMessage('Password must be at least 3 characters long.'),
      body('birthday').optional().isISO8601().withMessage('Birthday must be in format YYYY-MM-DD')
    ]
  }

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  userValidationRules,
  userUpdateValidationRules,
  validate,
}