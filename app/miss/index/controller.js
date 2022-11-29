import Controller from '@ember/controller';
import { cached } from '@glimmer/tracking';

export default class MissIndexController extends Controller {
  @cached
  get judged() {
    return Object.values(this.model.judge.miss).filter(
      (judgement) => judgement?.comment
    ).length;
  }

  get total() {
    return this.model.misses.length;
  }

  get todo() {
    return this.total - this.judged;
  }
}
