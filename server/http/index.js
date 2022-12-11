const bodyParser = require('body-parser');
const Joi = require('joi');

exports.H = function H(middleware) {
  return async function (req, res, next) {
    try {
      await middleware(req, res);
    } catch (e) {
      next(e);
    }
  };
};

exports.Accept = function Accept(schema) {
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
};

exports.WithAuth = function WithAuth(...permissionAlternatives) {
  return async (req, res, next) => {
    const identity = req.inject.service.identity;
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return unauthorized();
    const jwt = authHeader.replace('Bearer ', '');
    try {
      const account = await identity.verify(jwt);
      if (!verifyPermission(account, permissionAlternatives)) {
        return forbidden();
      }
      req.auth = account;
      next();
    } catch (e) {
      console.error(e.message);
      return unauthorized();
    }

    function verifyPermission(account, alternatives) {
      const permissionSet = new Set(account.permissions);
      return alternatives.find((permissions) => {
        return permissions.every((permission) => permissionSet.has(permission));
      });
    }

    function unauthorized() {
      res.status(401);
      res.send({ error: 'Unauthorized' });
    }

    function forbidden() {
      res.status(403);
      res.send({ error: 'forbidden' });
    }
  };
};

exports.Precondition = function Precondition(condition, schema = Joi.any()) {
  return (req, res, next) => {
    if (req.get(condition)) {
      const { error, value } = schema.validate(req.get(condition));
      if (error) {
        res.status(428);
        res.send({
          error: 'Precondition Required',
          details: error,
        });
        return;
      }
      req.conditions = req.conditions = {};
      req.conditions[condition] = value;
      next();
    } else {
      res.status(428);
      res.send({
        error: 'Precondition Required',
        message: `This request is only allowed with the ${condition} header`,
      });
    }
  };
};
