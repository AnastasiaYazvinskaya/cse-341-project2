const { body, validationResult } = require('express-validator')
const itemValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required.').isString().isLength({ min: 3, max: 5 }).withMessage('Name must be between 3 and 5 characters.'),
    body('description').notEmpty().withMessage('Description is required.').optional().isString().isLength({ min: 3, max: 5 }).withMessage('Description must be between 3 and 5 characters.'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0.'),
    body('stock').isInt({ gt: -1 }).withMessage('Stock must be a non-negative integer.'),
  ]
}

const itemUpdateValidationRules = () => {
  return [
    body('name').optional().isString().isLength({ min: 3, max: 5 }).withMessage('Name must be between 3 and 5 characters.'),
    body('description').optional().isString().isLength({ min: 3, max: 5 }).withMessage('Description must be between 3 and 5 characters.'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than 0.'),
    body('stock').optional().isInt({ gt: -1 }).withMessage('Stock must be a non-negative integer.'),
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
  itemValidationRules,
  itemUpdateValidationRules,
  validate,
}