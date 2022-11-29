import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MissIndexRoute extends Route {
  @service judge;
  model() {
    const { misses } = this.modelFor('miss');
    return {
      misses: misses.getAll(),
      judge: this.judge.getCurrent(),
    };
  }
}
