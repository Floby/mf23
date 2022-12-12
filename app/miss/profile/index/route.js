import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MissProfileIndexRoute extends Route {
  @service router;
  @service judge;
  model() {
    const miss = this.modelFor('miss.profile');
    const judgement = this.judge.getCurrentJudgementFor(miss.id);
    return { judgement, miss };
  }
  redirect(model) {
    if (!model.judgement?.comment) {
      this.router.transitionTo('miss.profile.judge');
    }
  }
  resetController(controller, isExiting) {
    if (isExiting) {
      controller.preserveScrollPosition = null;
    }
  }
}
