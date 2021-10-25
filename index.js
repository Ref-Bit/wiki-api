const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('express-rate-limit')({
  windowMs: 1 * 60 * 1000,
  max: 5,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(limiter);
app.set('trust proxy', 1);

app.use('/api/v1', require('./routes'));

const start = () => {
  app.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}...🚀`)
  );
};

start();
