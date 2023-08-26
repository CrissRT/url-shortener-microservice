require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const shortid = require('shortid');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlDatabase = {};

app.post("/api/shorturl", (req, res) => {
  const submittedUrl = req.body.url; // Get URL from input
  const transformedUrl = new URL(submittedUrl).hostname; //Transform for convenient form for lookup 

  // Check if it starts with correct protocol
  if(!(new URL(submittedUrl).protocol).startsWith("http")) {
    return res.send({ error: 'invalid url' });
  }

  // Checking DNS
  dns.lookup(transformedUrl, (err) => {
    if (err === "Error") {
      console.error('DNS lookup error:', err);
      return res.send({ error: 'invalid url' });
    } else {
      // To not save already saved URLs
      if(!urlDatabase.hasOwnProperty(transformedUrl)) {
        urlDatabase[submittedUrl] = shortid.generate();
      };

      // Send succesful respond
      res.send({
        original_url: submittedUrl,
        short_url: urlDatabase[submittedUrl]
      });
    }
  }); 
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const { short_url } = req.params;
  for(element in urlDatabase) {
    if(urlDatabase[element] === short_url) {
      return res.redirect(element);
    }
  }
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
