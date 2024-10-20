const { body, validationResult } = require('express-validator')
const { ObjectId } = require('mongodb');

const isValidObjectId = (value) => {
    if (!ObjectId.isValid(value)) {
        throw new Error('Invalid ID format');
    }
    return true;
};

const orderValidationRules = () => {
  return [
    body('productID').notEmpty().withMessage('Customer ID is required.').custom(isValidObjectId).withMessage('Invalid Product ID format'),
    body('userID').notEmpty().withMessage('Customer ID is required.').custom(isValidObjectId).withMessage('Invalid User ID format'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be greater than 0.'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required.')
      .isIn(['credit_card', 'paypal', 'cash']).withMessage('Invalid payment method.'),
    body('totalAmount').notEmpty().withMessage('Total amount is required.')
      .isFloat({ gt: 0 }).withMessage('Total amount must be greater than 0.'),
    body('status').notEmpty().withMessage('Order status is required.')
      .isIn(['Pending', 'Processing', 'Completed', 'Cancelled']).withMessage('Invalid order status.'),
    body('orderDate').notEmpty().withMessage('Order date is required.')
      .isISO8601().withMessage('Invalid date format. Use format YYYY-MM-DD'),
  ]
}

const orderUpdateValidationRules = () => {
  return [
    body('productID').optional().custom(isValidObjectId).withMessage('Invalid Product ID format'),
    body('userID').optional().custom(isValidObjectId).withMessage('Invalid User ID format'),
    body('quantity').optional().isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
    body('paymentMethod').optional().isIn(['credit_card', 'paypal', 'cash', 'Cancelled'])
      .withMessage('Status must be one of: credit_card, paypal, cash'),
    body('totalAmount').optional().isFloat({ gt: 0 }).withMessage('Total amount must be a positive number'),
    body('status').optional().isIn(['Pending', 'Processing', 'Completed', 'Cancelled'])
      .withMessage('Status must be one of: Pending, Processing, Completed, Cancelled'),
    body('orderDate').optional().isISO8601().toDate().withMessage('Order date must be a valid date (YYYY-MM-DD)')
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
  orderValidationRules,
  orderUpdateValidationRules,
  validate,
}