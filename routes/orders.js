const routes = require('express').Router();

const controller = require('../controllers/orders');
const validator = require('../validators/orders');

routes.get('/', controller.getOrders);
routes.get('/:id', controller.getOrder);
routes.post('/', validator.orderValidationRules(), validator.validate, controller.addOrder);
routes.put('/:id', validator.orderUpdateValidationRules(), validator.validate, controller.editOrder);
routes.delete('/:id', controller.deleteOrder);

module.exports = routes;