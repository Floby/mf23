import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class MissProfileIndexRoute extends Route {
  @service router;
  @service judge;
  @service panel;
  async model() {
    const miss = this.modelFor('miss.profile');
    const judgement = this.judge.getCurrentJudgementFor(miss.id);
    const judgements = await this.panel.getJudgementsForMiss(miss);
    return { judgement, judgements, miss };
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

  @action
  toggleFav(judgeId) {
    const { miss } = this.modelFor('miss.profile.index');
    this.judge.toggleFav(miss, judgeId);
    this.refresh();
    return false;
  }
}
