const cheerio = require('cheerio');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const BASE_URL = 'https://ar.wikipedia.org';

/**
 * Get DYK, ITD, ITN data from HTML
 * @async
 * @param {query: {selector, splitter, matcher?}} req
 * @param {statusCode, Data} res
 * @returns {[{},{},{}...{}]}
 */
exports.sectionsHandler = async (req = Request, res = Response) => {
  try {
    if (!req.query.selector) {
      console.log('CSS query selector is required!');
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send('CSS query selector is required!');
    }

    const data = [];
    const html = (await axios.get(BASE_URL)).data;
    const $ = cheerio.load(html);

    $(req.query.selector, html).each(function () {
      const content = $(this).children().text().split(req.query.splitter);
      content
        .filter(item => item)
        .map(item => {
          data.push({
            info: req.query.matcher
              ? item.replace(req.query.matcher, '').trim()
              : item,
          });
        });
    });
    return res.status(StatusCodes.OK).json(data);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send('<h5>Something went wrong. Please try again later.</h5>');
  }
};

/**
 * Get data from HTML
 * @async
 * @param {*} req
 * @param {statusCode, Data} res
 * @returns {[{},{},{}...{}]}
 */
exports.recentDeathsHandler = async (req = Request, res = Response) => {
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
};

/**
 * Get featured article data from HTML
 * @async
 * @param {*} req
 * @param {statusCode, Data} res
 * @returns {{}}
 */
exports.featuredArticleHandler = async (req = Request, res = Response) => {
  try {
    const html = (await axios.get(BASE_URL)).data;
    const $ = cheerio.load(html);

    const data = $('div.mp-tfa.mp-Sec > p').first().text();
    return res.status(200).json({ content: data });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong...');
  }
};
