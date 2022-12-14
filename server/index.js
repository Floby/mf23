const createContainer = require('./container');

// To use it create some files under `mocks/`
// e.g. `server/mocks/ember-hamsters.js`
//
// module.exports = function(app) {
//   app.get('/ember-hamsters', function(req, res) {
//     res.send('hello');
//   });
// };

module.exports = function (app) {
  const container = createContainer(process.env);
  app.use((req, res, next) => {
    req.inject = container;
    next();
  });
  const globSync = require('glob').sync;
  const mocks = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
  const proxies = globSync('./proxies/**/*.js', { cwd: __dirname }).map(
    require
  );

  // Log proxy requests
  const morgan = require('morgan');
  app.use(morgan('dev'));

  mocks.forEach((route) => route(app));
  proxies.forEach((route) => route(app));
};
