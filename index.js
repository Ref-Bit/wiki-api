const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('<h1>Wiki API</h1>');
});

const start = () => {
  app.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}...🚀`)
  );
};

start();
