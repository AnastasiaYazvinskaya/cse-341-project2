const express = require('express');
const routes = express.Router();
const { requiresAuth } = require('express-openid-connect');
const controller = require('../controllers/auth');
const validator = require('../validators/users');

routes.post('/register', validator.userValidationRules(), controller.registerUser);

routes.get('/login', controller.loginUser); //google login
routes.get('/oauth', validator.userValidationRules(), controller.oauthUser); //create user if not exist
routes.post('/signin', controller.loginLocalUser); //local login
routes.get('/logout', requiresAuth(), controller.logoutUser); 


module.exports = routes;