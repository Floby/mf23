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
    return null;
  }

  @action
  saveJudgement(judgement) {
    if (!judgement.comment.trim()) {
      return;
    }
    const judge = this.judge.getCurrent();
    const miss = this.modelFor('miss.profile');
    const version = judge.miss[miss.id]?.version || 0;
    const updatedAt = Date.now();
    judge.miss[miss.id] = {
      ...judgement,
      version: version + 1,
      updatedAt,
    };
    this.judge.saveCurrent(judge);
    this.router.transitionTo('miss.profile');
  }
}
