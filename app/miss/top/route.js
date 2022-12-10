import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MissTopRoute extends Route {
  @service panel;
  @service judge;

  async model() {
    const top = await this.panel.getTop();
    console.log(top);
    return { top, judge: this.judge.getCurrent() };
  }
}
