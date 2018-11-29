const express = require('express');
const router = express.Router();
const controller = require('./routerController')
const jwt = require('jsonwebtoken');


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