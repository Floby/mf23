import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MissTopJudgeRoute extends Route {
  @service panel;
  model({ judge_id }) {
    const judge = this.panel;
    const misses = this.modelFor('miss');
    const top = judge.top.misses.map((missId) => ({
      ...misses.find((m) => m.id === missId),
      mention: judge.miss[missId].mention,
      comment: judge.miss[missId].comment,
    }));
    return { judge, top };
  }
}
