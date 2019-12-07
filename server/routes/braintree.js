const express = require('express');
const router =  express.Router();
const { requireSignin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const {generateTokens, processPayment} = require('../controllers/braintree');

router.get('/braintree/getToken/:userId', requireSignin, isAuth, generateTokens );
router.post('/braintree/payment/:userId', requireSignin, isAuth, processPayment );

router.param('userId', userById);

module.exports = router;