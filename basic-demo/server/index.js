const express = require('express');
const crypto = require('crypto');
const https = require('https');
const http = require('http');
const fs = require('fs');
const base64 = require('base64-stream');

// replace with your secret
const secret = 'W62wB9JjW3tFyUMtF5QhRSbk'; // secret for "demo" client ID

const basedir = `${__dirname}/..`;

const app = express();
app.set('view engine', 'ejs');
app.set('views', `${basedir}/views`);

app.post('/signer', function (req, res) {
  req
    .pipe(crypto.createHmac('sha256', secret))
    .pipe(base64.encode())
    .pipe(res.set('Content-Type', 'text/plain'));
});

app.use(express.static(`${basedir}/static`));

const ssl = ['1', 'true', 'yes', 'on', 'enable'].includes(process.env.SSL);

const server = ssl
  ? https.createServer(
      {
        key: fs.readFileSync(`${basedir}/ssl/server.key`, 'utf8'),
        cert: fs.readFileSync(`${basedir}/ssl/server.crt`, 'utf8')
      },
      app
    )
  : http.createServer(app);

const port = parseInt(process.env.PORT) || (ssl ? 8443 : 8080);

server.listen(port, function () {
  console.log(`Server is listening on ${ssl ? 'https' : 'http'}://localhost:${port}.`);
});
