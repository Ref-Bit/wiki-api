const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL =
  'https://ar.wikipedia.org/wiki/%D8%A7%D9%84%D8%B5%D9%81%D8%AD%D8%A9_%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9';

app.get('/', (req, res) => {
  res.send('<h1>Wiki API</h1>');
});

app.get('/dyk', async (req, res) => {
  try {
    const dykData = [];
    const dykHTML = (await axios.get(BASE_URL)).data;
    const $ = cheerio.load(dykHTML);

    $('div.mp-dyk ul', dykHTML).each(function () {
      const content = $(this).children().text().split('؟');
      content
        .filter(item => item)
        .map(item => {
          dykData.push({
            info: item.replace(/\... /gm, ''),
          });
        });
    });
    return res.status(StatusCodes.OK).json(dykData);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send('<h5>Something went wrong. Please try again later.</h5>');
  }
});

app.get('/itd', async (req, res) => {
  try {
    const itdData = [];
    const itdHTML = (await axios.get(BASE_URL)).data;
    const $ = cheerio.load(itdHTML);

    $('div.mp-itd ul', itdHTML).each(function () {
      const content = $(this).children().text().split('.');
      content
        .filter(item => item)
        .map(item => {
          itdData.push({
            info: item,
          });
        });
    });
    return res.status(StatusCodes.OK).json(itdData);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send('<h5>Something went wrong. Please try again later.</h5>');
  }
});

app.get('/itn', async (req, res) => {
  try {
    const itnData = [];
    const itnHTML = (await axios.get(BASE_URL)).data;
    const $ = cheerio.load(itnHTML);

    $('div.mp-itn ul:nth-child(3)', itnHTML).each(function () {
      const content = $(this).children().text().split('.');
      content
        .filter(item => item)
        .map(item => {
          itnData.push({
            info: item,
          });
        });
    });
    return res.status(StatusCodes.OK).json(itnData);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send('<h5>Something went wrong. Please try again later.</h5>');
  }
});

const start = () => {
  app.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}...🚀`)
  );
};

start();
