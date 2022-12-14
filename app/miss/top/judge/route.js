import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MissTopJudgeRoute extends Route {
  @service panel;
  @service auth;
  @service router;

  async model({ judge_id }) {
    if (judge_id === this.auth.userInfo?.sub) {
      return this.router.transitionTo('miss.top.me');
    }
    const misses = this.modelFor('miss').misses.getAll();
    const judge = await this.panel.getById(judge_id);
    const top = (judge.top?.miss || []).map((missId) => ({
      ...misses.find((m) => m.id === missId),
      mention: judge.miss[missId].mention,
      comment: judge.miss[missId].comment,
    }));
    return { judge, top };
  }
}
