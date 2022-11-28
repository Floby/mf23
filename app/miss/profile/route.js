import Route from '@ember/routing/route';

export default class MissProfileRoute extends Route {
  async model(params) {
    const misses = this.modelFor('miss');
    const { miss_id } = params;
    const miss = misses.get(miss_id);
    return {
      ...miss,
      judgements: [],
    };
  }
}
