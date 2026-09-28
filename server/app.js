const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1); // needed on Render/Railway etc. so rate-limit sees the real IP
app.use(helmet());
if (process.env.CLIENT_URL) app.use(cors({ origin: process.env.CLIENT_URL })); // only if frontend is hosted separately
app.use(express.json({ limit: '400kb' }));

app.use('/api', routes);
app.use('/api', notFound);

// Production: serve the built React app (client/dist) from this same server
const dist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
