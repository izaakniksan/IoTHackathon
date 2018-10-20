'use strict';

const express = require('express')
var Cloudant = require('@cloudant/cloudant');
var async_req = require('async');

const port = 3001
const url = 'https://dminsitchappordediverede:0d213f72e3dda91a6d27acd1bb23d4243a3f5d45@958edf45-e095-4a52-99d1-ce088c9b2c39-bluemix.cloudant.com';
const app = express()
var cloudant = Cloudant({ url: url });
const dbname = 'sensordata';
var db = null;
var time = 0;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/', (req, res) => res.send('Hello World node!'))
app.get('/data', (req, res) => {
  db.find({
    "selector": {
    }
  }, function (er, result) {
    if (er) {
      console.log(err);
      res.status = 401;
      res.send('Error');
    }
    console.log('Found 1 documents of length', result.docs.length);
    console.log('  Doc id: %s, payload: ', result.docs[0]._id, result.docs[0].payload);

    res.status = 200;
    res.send(JSON.stringify(result.docs));
  });
});

app.get('/recentData', (req, res) => {
  console.log('Checking db for new data...');

  db.find({
    "selector": {
      "payload": {
        "d": {
          "time": {
            "$gt": time
          }
        }
      }
    }
  }, function (er, result) {
    if (er) {
      console.log(err);
      res.status = 401;
      res.send('Error');
    }
    console.log('Found documents of length', result.docs.length);
    //  for (var i = 0; i < result.docs.length; i++) {
    if (result.docs.length > 0) {
      console.log('  Doc id: %s, payload: ', result.docs[0]._id, result.docs[0].payload);
      //  }
      time = result.docs[result.docs.length-1].payload.d.time;
      console.log('Time: ', time);
    }

    res.status = 200;
    res.send(JSON.stringify(result.docs));
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

if (!url) {
  console.error("Please put the URL of your Cloudant instance in an environment variable 'CLOUDANT_URL'");
  process.exit(1);
}

db = cloudant.db.use(dbname);