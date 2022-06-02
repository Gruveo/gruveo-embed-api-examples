const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const https = require('https');
const http = require('http');
const fs = require('fs');
const { Base64Encode } = require('base64-stream');

// replace with your secret
const secret = 'W62wB9JjW3tFyUMtF5QhRSbk'; // secret for "demo" client ID

const basedir = `${__dirname}/..`;

const app = express();
app.set('view engine', 'ejs');
app.set('views', `${basedir}/views`);

const corsOptions = {
  origin: /\.gruveo\.com$/, // specify your domain
  methods: ['POST'],
};

app.options('/signer', cors(corsOptions));

app.all('/signer', cors(corsOptions), function (req, res) {
  if (req.method !== 'POST') {
    res.set('Allow', 'POST, OPTIONS').sendStatus(405).end();
  } else if (!req.is('text/plain')) {
    res.sendStatus(415).end();
  } else if (!req.accepts('text/plain')) {
    res.sendStatus(406).end();
  } else {
    req
      .pipe(crypto.createHmac('sha256', secret))
      .pipe(new Base64Encode())
      .pipe(res.set('Content-Type', 'text/plain'));
  }
});

app.use(express.static(`${basedir}/static`));

const ssl = ['1', 'true', 'yes', 'on', 'enable'].indexOf(process.env.SSL) !== -1;

const server = ssl
  ? https.createServer(
      {
        key: fs.readFileSync(`${basedir}/ssl/server.key`, 'utf8'),
        cert: fs.readFileSync(`${basedir}/ssl/server.crt`, 'utf8')
      },
      app
    )
  : http.createServer(app);

const port = parseInt(process.env.PORT, 10) || (ssl ? 8443 : 8080);

server.listen(port, function () {
  console.log(`Server is listening on ${ssl ? 'https' : 'http'}://localhost:${port}.`);
});
