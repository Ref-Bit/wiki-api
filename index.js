const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api/v1', require('./routes'));

const start = () => {
  app.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}...🚀`)
  );
};

start();
