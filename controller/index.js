const cheerio = require('cheerio');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const BASE_URL = 'https://ar.wikipedia.org';

/**
 * GET data from HTML
 * @async
 * @param {query: {selector, splitter, matcher?}} req
 * @param {statusCode, Data} res
 * @returns {[{},{},{}...{}]}
 */
exports.apiHandler = async function (req = Request, res = Response) {
  try {
    if (!req.query.selector) {
      console.log('CSS query Selector is required!');
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
              ? item.replace(new RegExp(req.query.matcher), '')
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
