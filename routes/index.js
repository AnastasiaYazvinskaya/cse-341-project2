const router = require('express').Router();
//const { isAuthenticated } = require('../config/auth');
const { requiresAuth } = require('express-openid-connect');

router.use('/', require('./auth'));
router.use('/', require('./swagger'));
router.get('/', (req, res) => {
    //#swagger.tags=['Welcome']
    //res.send("Welcome! Let's get an order");
    res.send(req.oidc.isAuthenticated() ? `Logged in (${req.oidc.user.email})<br><a href="/logout">Log out</a>` : 'Logged out<br><a href="/login">Log in by Google</a>');
});

router.use('/users', requiresAuth(), require('./users'));
router.use('/items', require('./items'));
router.use('/orders', requiresAuth(), require('./orders'));

module.exports = router;