const routes = require('express').Router();

const controller = require('../controllers/users');
const validator = require('../validators/users');

routes.get('/', controller.getUsers);
routes.get('/:id', controller.getUser);
routes.post('/', validator.userValidationRules(), validator.validate, controller.addUser);
routes.put('/:id', validator.userUpdateValidationRules(), validator.validate, controller.editUser);
routes.delete('/:id', controller.deleteUser);

module.exports = routes;