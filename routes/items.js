const routes = require('express').Router();

const controller = require('../controllers/items');
const validator = require('../validators/items');

routes.get('/', controller.getItems);
routes.get('/:id', controller.getItem);
routes.post('/', validator.itemValidationRules(), validator.validate, controller.addItem);
routes.put('/:id', validator.itemUpdateValidationRules(), validator.validate, controller.editItem);
routes.delete('/:id', controller.deleteItem);

module.exports = routes;