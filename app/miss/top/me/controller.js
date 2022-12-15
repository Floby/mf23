import Controller from '@ember/controller';
import { cached, tracked } from '@glimmer/tracking';

export default class MissTopMeController extends Controller {
  @tracked minimum = 4;

  @cached
  get missAboveMin() {
    const judge = this.model.judge;
    return this.model.misses
      .filter((m) => mention(m) >= this.minimum)
      .sort((a, b) => mention(b) - mention(a));

    function mention(miss) {
      return judge.miss[miss.id]?.mention;
    }
  }

  onTopSorted(newTop, moved) {
    debugger;
  }
}