const express = require('express');
const router = express.Router();
const { apiHandler, BASE_URL } = require('../controller');
const cheerio = require('cheerio');
const axios = require('axios');

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

/**
 * @method GET
 * @access public
 * @description API for recent deaths
 */
router.get('/recent-deaths', async (req, res) => {
  try {
    const data = [];
    const html = (await axios.get(BASE_URL)).data;
    const $ = cheerio.load(html);

    $('div.mp-itn.mp-Sec > ul:nth-child(5) > li:nth-child(2) a').each(function (
      i
    ) {
      const title = $(this).text();
      const link = $(this).attr('href');

      // Skip the first iteration
      if (i === 0) return;

      data.push({
        title,
        link: BASE_URL + link,
      });
    });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong...');
  }
});

module.exports = router;
