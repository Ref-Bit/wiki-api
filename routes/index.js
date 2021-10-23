const express = require('express');
const router = express.Router();
const { apiHandler } = require('../controller');

/**
 * @method GET
 * @access public
 * @description API base response
 * @returns {HTML}
 */
router.get('/', (req, res) => {
  res.send('<h1>Wiki API</h1>');
});

/**
 * @method GET
 * @param {requestCallback} apiHandler
 * @access public
 * @description API for Did you know
 */
router.get('/dyk', apiHandler);

/**
 * @method GET
 * @param {requestCallback} apiHandler
 * @access public
 * @description API for In this day
 */
router.get('/itd', apiHandler);

/**
 * @method GET
 * @param {requestCallback} apiHandler
 * @access public
 * @description API for In the news
 */
router.get('/itn', apiHandler);

module.exports = router;
