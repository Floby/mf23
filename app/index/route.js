import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service auth;

  model() {
    const isAuthenticated = this.auth.isAuthenticated;
    const { judge } = this.modelFor('application');
    const isDone = Object.keys(judge.miss).length === 30;
    return { judge, isAuthenticated, isDone };
  }
}
