const Joi = require('joi');
const Miss = require('../../../app/models/miss.referential.json');
const { H, Precondition, Accept, WithAuth } = require('../../http');
const express = require('express');

module.exports = function (app) {
  console.log('PID', process.pid);
  let JudgeRouter = express.Router();

  JudgeRouter.get(
    '/',
    WithAuth([]),
    H(async (req, res) => {
      const repo = req.inject.repository.judge;
      const judges = await repo.list();
      res.send(judges);
    })
  );

  JudgeRouter.get(
    '/me',
    WithAuth([]),
    H(async (req, res) => {
      const repo = req.inject.repository.judge;
      const id = req.auth.sub;
      const judge = await repo.get(id);
      if (judge) {
        res.setHeader('Last-Modified', new Date(judge.updatedAt).toUTCString());
        res.setHeader('Cache-Control', 'must-revalidate');
        res.send(judge);
      } else {
        res.status(404);
        res.send({ error: 'not found' });
      }
    })
  );

  JudgeRouter.put(
    '/me',
    WithAuth([]),
    Precondition('If-Unmodified-Since', Joi.date()),
    Accept(JudgeValidator),
    H(async (req, res) => {
      const ifSince = req.conditions['If-Unmodified-Since'];
      const id = req.auth.sub;
      console.log({ ifSince, id, nom: req.body.nom });
      const repo = req.inject.repository.judge;
      const judge = await repo.get(id);
      const savedAt = Math.floor((judge?.updatedAt || 0) / 1000) * 1000; // get seconds
      if (ifSince < savedAt) {
        res.status(412);
        res.send({
          error: 'Precondition Failed',
          detail: {
            message: 'Resource is fresher on server',
            saved: new Date(judge.updatedAt),
            yours: new Date(ifSince),
          },
        });
      }
      await repo.save({ ...req.body, id });
      res.header('Last-Modified', new Date(req.body.updatedAt).toUTCString());
      res.send(await repo.get(id));
    })
  );

  app.use('/api/judge', JudgeRouter);
};

const JudgeValidator = Joi.object({
  id: Joi.string().optional().max(100).description('Identifier'),
  nom: Joi.string().required().max(100).description('The name of the judge'),
  avatar: Joi.string().uri({ scheme: ['https'] }),
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
