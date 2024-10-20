const router = require('express').Router();

router.use('/', require('./swagger'));
router.get('/', (req, res) => {
    //#swagger.tags=['Welcome']
    res.send("Welcome! Let's get an order");
});

router.use('/users', require('./users'));
router.use('/items', require('./items'));
router.use('/orders', require('./orders'));

module.exports = router;