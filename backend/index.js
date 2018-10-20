'use strict';

const express = require('express')
var Cloudant = require('@cloudant/cloudant');
var async_req = require('async');

const port = 3001
const url = 'https://dminsitchappordediverede:0d213f72e3dda91a6d27acd1bb23d4243a3f5d45@958edf45-e095-4a52-99d1-ce088c9b2c39-bluemix.cloudant.com';
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

var time = 0;
var average_gas = -1;
var n_average_gas = 0;
db = cloudant.db.use(dbname);

setInterval(() => {
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
    }, function(er, result) {
      if (er) {
        throw er;
      }

      for (var i = 0; i < result.docs.length; i++) {
        console.log('Doc id: %s, payload: ', result.docs[i]._id, result.docs[i].payload);
        if (result.docs[i].payload.d.time > time) {
          time = parseInt(result.docs[i].payload.d.time);
        }
        if (average_gas < 0) {
          average_gas = parseFloat(result.docs[i].payload.d.Gas);
        }
        else {
          average_gas = (average_gas * n_average_gas + parseFloat(result.docs[i].payload.d.Gas)) / (n_average_gas + 1);
        }
        n_average_gas += 1;
        console.log('moving gas average: ' + (average_gas).toFixed(6) + " iteration " + n_average_gas);
        if (parseFloat(result.docs[i].payload.d.Gas) > 1.05 * average_gas) {

          console.log("***************\n**** ALERT ****\n***************");
        }
      }
    });
}, 1000)
