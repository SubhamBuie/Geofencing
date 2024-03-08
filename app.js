const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const apiRoutes = require('./routes/apiRoutesHandler');
const mongoose = require('mongoose');
const config = require('./config');
const compression = require('compression');

const app = express();

app.get('/', (req, res) => res.status(200).sendStatus(200));

const server = http.createServer(app);

mongoose.connect(config.DB_CONNECTION_STRING);

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);
mongoose.connection.once('open', () => {
  console.log('Database connected');
});

app.use(compression());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.set('view engine', 'ejs');

app.use('/api', apiRoutes);

app.use((_, res) =>
  res.status(404).send({
    error: '404 route not found',
  })
);

module.exports = server;
