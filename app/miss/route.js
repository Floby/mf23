import Route from '@ember/routing/route';
import miss from '../models/miss';

export default class MissRoute extends Route {
  model() {
    return { misses: miss };
  }
}
