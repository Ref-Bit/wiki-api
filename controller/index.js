const cheerio = require('cheerio');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const locales = require('../locales');

/**
 * Get DYK, ITD, ITN data from HTML
 * @async
 * @param {query: {selector, splitter, matcher?}} req
 * @param {statusCode, Data} res
 * @returns {[{},{},{}...{}]}
 */
exports.sectionsHandler = async (req = Request, res = Response) => {
  const path = req.path.slice(1);
  const locale = req.query.locale.toLowerCase();
  const matcher = req.query.matcher; // To remove the dots from text

  try {
    if (!locale) {
      console.log('Wiki locale is required!');
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send('Wiki locale is required!');
    }

    const data = [];
    const html = (await axios.get(`https://${locale}.wikipedia.org`)).data;
    const $ = cheerio.load(html);

    $(locales[locale][path].selector, html).each(function () {
      const content = $(this)
        .children()
        .text()
        .split(locales[locale][path].splitter);
      content
        .filter(item => item)
        .map(item => {
          data.push({
            info: matcher ? item.replace(matcher, '').trim() : item,
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
  const path = req.path.slice(1);
  const locale = req.query.locale.toLowerCase();

  try {
    if (!locale) {
      console.log('Wiki locale is required!');
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send('Wiki locale is required!');
    }

    const data = [];
    const html = (await axios.get(`https://${locale}.wikipedia.org`)).data;
    const $ = cheerio.load(html);

    $(locales[locale][path].selector).each(function (i) {
      const title = $(this).text();
      const link = $(this).attr('href');

      // Skip the first iteration
      if (i === 0 && locale !== 'en') return;

      data.push({
        title,
        link: `https://${locale}.wikipedia.org` + link,
      });
    });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send('Something went wrong...');
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
  const path = req.path.slice(1);
  const locale = req.query.locale.toLowerCase();

  try {
    if (!locale) {
      console.log('Wiki locale is required!');
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send('Wiki locale is required!');
    }

    const html = (await axios.get(`https://${locale}.wikipedia.org`)).data;
    const $ = cheerio.load(html);

    const data = $(locales[locale][path].selector).first().text();
    return res.status(StatusCodes.OK).json({ content: data });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send('Something went wrong...');
  }
};
