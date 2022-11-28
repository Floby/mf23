'use strict';

module.exports = function (app) {
  console.log('PID', process.pid);
  const bodyParser = require('body-parser');
  const express = require('express');
  let JudgeRouter = express.Router();

  JudgeRouter.get('/me', function (req, res) {
    res.send({
      '/judge/me': {
        id: req.params.id,
      },
    });
  });

  JudgeRouter.put('/me', bodyParser.json(), (req, res) => {
    res.send({
      '/judge/me': {
        id: req.params.id,
      },
    });
  });

  app.use('/api/judge', JudgeRouter);
};
