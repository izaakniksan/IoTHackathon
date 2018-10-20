'use strict';

const express = require('express')
var Cloudant = require('@cloudant/cloudant');
var async_req = require('async');

const port = 3001
const url = '';
const app = express()
var cloudant = Cloudant({url: url});
const dbname = 'sensordata';
var db = null;
var doc = null;

app.get('/', (req, res) => res.send('Hello World node!'))
app.get('/data', (req, res) => res.send("data here" + JSON.stringify(doc)))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

if (!url) {
  console.error("Please put the URL of your Cloudant instance in an environment variable 'CLOUDANT_URL'");
  process.exit(1);
}

db = cloudant.db.use(dbname);

// // read a document
// var readDocument = function(callback) {
//   console.log("Reading document '2309ee5cd716d9b951580276fec3d940'");
//   db.get('2309ee5cd716d9b951580276fec3d940', function(err, data) {
//     console.log('Error:', err);
//     console.log('Data:', data);
//     // keep a copy of the doc so we know its revision token
//     doc = data;
//     callback(err, data);
//   });
// };

db.index(function(er, result) {
  if (er) {
    throw er;
  }

  console.log('The database has %d indexes', result.indexes.length);
  for (var i = 0; i < result.indexes.length; i++) {
    console.log('  %s (%s): %j', result.indexes[i].name, result.indexes[i].type, result.indexes[i].def);
  }
});

db.find({
   "selector": {
   }
}, function(er, result) {
  if (er) {
    throw er;
  }

  console.log('Found 1 documents with name Alice', result.docs.length);
  for (var i = 0; i < result.docs.length; i++) {
    console.log('  Doc id: %s, time: ', result.docs[i]._id, result.docs[i].payload);
  }
});
//
// async_req.series([readDocument]);
