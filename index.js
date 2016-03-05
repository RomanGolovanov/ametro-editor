'use strict';

var port = 3000;
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/api', function (req, res) {
  res.send({timestamp: new Date()});
});

app.listen(port, function () {
  console.log('Backend service listening on port ' + port);
});

