import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service judge;
  async model() {
    return { judge: this.judge.getCurrent() };
  }
}
