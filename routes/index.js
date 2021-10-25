const express = require('express');
const router = express.Router();
const {
  sectionsHandler,
  recentDeathsHandler,
  featuredArticleHandler,
} = require('../controller');

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
 * @param {requestCallback} sectionsHandler
 * @access public
 * @description API for Did you know
 */
router.get(
  '/dyk',
  (req, res, next) => {
    req.query.matcher = /\.../gm;
    next();
  },
  sectionsHandler
);

/**
 * @method GET
 * @param {requestCallback} sectionsHandler
 * @access public
 * @description API for In this day
 */
router.get('/itd', sectionsHandler);

/**
 * @method GET
 * @param {requestCallback} sectionsHandler
 * @access public
 * @description API for In the news
 */
router.get('/itn', sectionsHandler);

/**
 * @method GET
 * @param {requestCallback} recentDeathsHandler
 * @access public
 * @description API for recent deaths
 */
router.get('/rd', recentDeathsHandler);

/**
 * @method GET
 * @param {requestCallback} featuredArticleHandler
 * @access public
 * @description API for featured article
 */
router.get('/fa', featuredArticleHandler);

module.exports = router;
