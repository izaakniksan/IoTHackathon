'use strict';

const express = require('express')
var Cloudant = require('@cloudant/cloudant');
var async_req = require('async');

const port = 3001
const url = 'https://ildsuadmysevinshandersar:' + process.env.cloudant_password + '@674e8643-6668-4007-a168-740e6341e110-bluemix.cloudant.com';
const app = express()
var cloudant = Cloudant({url: url});
const dbname = 'sensor';
var db = null;
var doc = null;

app.get('/', (req, res) => res.send('Hello World node!'))
app.get('/data', (req, res) => res.send("data here" + JSON.stringify(doc)))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

if (!url) {
  console.error("Please put the URL of your Cloudant instance in an environment variable 'CLOUDANT_URL'");
  process.exit(1);
}

// read a document
var readDocument = function(callback) {
  db = cloudant.db.use(dbname);
  console.log("Reading document '2309ee5cd716d9b951580276fec3d940'");
  db.get('2309ee5cd716d9b951580276fec3d940', function(err, data) {
    console.log('Error:', err);
    console.log('Data:', data);
    // keep a copy of the doc so we know its revision token
    doc = data;
    callback(err, data);
  });
};

async_req.series([readDocument]);
