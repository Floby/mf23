import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MissProfileIndexRoute extends Route {
  @service router;
  @service judge;
  model() {
    const miss = this.modelFor('miss.profile');
    const judgement = this.judge.getCurrentJudgementFor(miss.id);
    return judgement;
  }
  redirect(model) {
    if (!model?.comment) {
      this.router.transitionTo('miss.profile.judge');
    }
  }
}
