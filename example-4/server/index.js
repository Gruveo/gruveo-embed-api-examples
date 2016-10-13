const express = require('express');
const crypto = require('crypto');
const https = require('https');
const fs = require('fs');

const clientId = process.env.GRUVEO_API_CLIENT_ID;
const secret = process.env.GRUVEO_API_SECRET;

if (!clientId || !secret) {
  console.error('Please provide GRUVEO_API_CLIENT_ID and GRUVEO_API_SECRET environment variables.');
  process.exit(1);
}

const basedir = `${__dirname}/..`;

const app = express();
app.set('view engine', 'ejs');
app.set('views', `${basedir}//views`);

app.get('/', function(req, res) {
  const generated = Math.floor(Date.now() / 1000);
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(generated.toString());

  res.render('index', {
    clientid: JSON.stringify(clientId),
    secret: JSON.stringify(secret),
    generated: JSON.stringify(generated),
    signature: JSON.stringify(hmac.digest('base64'))      
  });
});

app.use(express.static(`${basedir}/static`));

const options = {
  key: fs.readFileSync(`${basedir}/ssl/server.key`, 'utf8'),
  cert: fs.readFileSync(`${basedir}/ssl/server.crt`, 'utf8')
};

const httpsServer = https.createServer(options, app);

const port = process.env.PORT || '8443';

httpsServer.listen(parseInt(port), function () {
  console.log(`Server is listening on https://localhost:${port}.`);
});
