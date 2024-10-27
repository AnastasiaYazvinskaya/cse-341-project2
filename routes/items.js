const routes = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const controller = require('../controllers/items');
const validator = require('../validators/items');

routes.get('/', controller.getItems);
routes.get('/:id', controller.getItem);
routes.post('/', requiresAuth(), validator.itemValidationRules(), validator.validate, controller.addItem);
routes.put('/:id', requiresAuth(), validator.itemUpdateValidationRules(), validator.validate, controller.editItem);
routes.delete('/:id', requiresAuth(), controller.deleteItem);

module.exports = routes;