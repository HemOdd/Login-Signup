const express = require('express');
const router = express.Router();
const User = require('./model');
const session = require('express-session');
const path = require('path');
const controller = require('./routerController')


/**
* Get route for reading data at root using controller functions.
*/
router.get('/', controller.getFunc);

/**
* Post route for updating data at root using controller functions.
*/
router.post('/', controller.postFunc);
router.post('/views',controller.postEditForm);

module.exports = router;