import Route from '@ember/routing/route';
import { service } from '@ember/service';

import { action } from '@ember/object';

export default class MissTopMeRoute extends Route {
  @service judge;
  model() {
    const judge = this.judge.getCurrent();
    const misses = this.modelFor('miss').misses.getAll();
    const top = judge.top.miss.map((id) => ({
      ...misses.find((m) => m.id === id),
      mention: judge.miss[id].mention,
      comment: judge.miss[id].comment,
    }));
    return { judge, top, misses };
  }

  @action
  initTop(misses) {
    this.judge.saveTop(misses);
    this.refresh();
  }

  @action
  resetTop() {
    this.judge.saveTop([]);
    this.refresh();
  }
}
