import Route from '@ember/routing/route';

export default class MissIndexRoute extends Route {
  model() {
    const miss = this.modelFor('miss');
    return miss.getAll();
  }
}
