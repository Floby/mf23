import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service judge;
  async model() {
    return this.judge.getCurrent();
  }
}