'use strict';

var port = 3000;
var host = '127.0.0.1';

var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/api', function (req, res) {
  res.send({timestamp: new Date()});
});

app.listen(port, host, function () {
  console.log('Backend service listening on port ' + port);
});

