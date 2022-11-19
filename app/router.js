import EmberRouter from '@ember/routing/router';
import config from 'mf23/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('miss', function () {
    this.route('profile', { path: '/:miss_id' }, function () {
      this.route('judge');
    });
  });
});
