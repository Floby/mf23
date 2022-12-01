const Joi = require('joi');
const Miss = require('../../../app/models/miss.referential.json');
const bodyParser = require('body-parser');
const express = require('express');

module.exports = function (app) {
  console.log('PID', process.pid);
  let JudgeRouter = express.Router();

  JudgeRouter.get(
    '/:id',
    H(async (req, res) => {
      const repo = req.inject.repository.judge;
      const judge = await repo.get('me');
      if (judge) {
        res.setHeader('Last-Modified', new Date(judge.updatedAt).toUTCString());
        res.send(judge);
      } else {
        res.status(404);
        res.send({ error: 'not found' });
      }
    })
  );

  JudgeRouter.put(
    '/:id',
    Accept(JudgeValidator),
    H(async (req, res) => {
      console.log(req.inject);
      const repo = req.inject.repository.judge;
      await repo.save({ ...req.body, id: 'me' });
      res.send(await repo.get('me'));
    })
  );

  app.use('/api/judge', JudgeRouter);
};

function H(middleware) {
  return async function (req, res, next) {
    try {
      await middleware(req, res);
    } catch (e) {
      next(e);
    }
  };
}

function Accept(schema) {
  return [bodyParser.json(), validate];

  function validate(req, res, next) {
    try {
      req.body = Joi.attempt(req.body, schema, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      if (!error.details) return next(error);
      res.status(400);
      res.send({
        error: 'Invalid payload',
        errors: error.details,
      });
    }
  }
}

const JudgeValidator = Joi.object({
  id: Joi.string().required().max(100).description('Identifier'),
  nom: Joi.string().required().max(100).description('The name of the judge'),
  updatedAt: Joi.number().required().integer().description('Javascript epoch'),
  miss: Joi.object(
    mapObject(Miss, () =>
      Joi.object({
        comment: Joi.string().max(1000),
        mention: Joi.number().valid(0, 1, 2, 3, 4, 5, 6),
        version: Joi.number().integer().min(1),
        updatedAt: Joi.number().integer().description('Javascript epoch'),
        createdAt: Joi.number().integer().description('Javascript epoch'),
      }).optional()
    )
  ).required(),
});

function mapObject(from, keyMapper) {
  return Object.keys(from).reduce(
    (mapped, key) => ({
      ...mapped,
      [key]: keyMapper(from[key], key),
    }),
    {}
  );
}
