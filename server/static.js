const express = require('express');
const path = require('path');
const fs = require('fs');
module.exports = function (app) {
  app.use(
    express.static(path.join(__dirname, '../dist'), {
      index: false,
    })
  );
  app.use('/', serveIndex);
  app.use('/miss', serveIndex);
};

const index = fs.readFileSync(
  path.join(__dirname, '../dist/index.html'),
  'utf8'
);
function serveIndex(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.send(index);
}
