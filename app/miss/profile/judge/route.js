import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class MissProfileJudgeRoute extends Route {
  @service router;
  @service judge;
  model() {
    const miss = this.modelFor('miss.profile');
    const judge = this.judge.getCurrent();
    if (judge.miss[miss.id]) {
      return judge.miss[miss.id];
    }
    return {
      mention: 2,
      comment: '',
    };
  }

  @action
  saveJudgement(judgement) {
    if (!judgement.comment.trim()) {
      return;
    }
    const judge = this.judge.getCurrent();
    const miss = this.modelFor('miss.profile');
    judge.miss[miss.id] = judgement;
    this.judge.saveCurrent(judge);
    this.router.transitionTo('miss.profile');
  }
}
