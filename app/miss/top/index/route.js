import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MissTopIndexRoute extends Route {
  @service panel;
  @service judge;

  async model() {
    const top = await this.panel.getTop();
    const roundTop = await this.panel.getRoundTop();
    return { top, roundTop, judge: this.judge.getCurrent() };
  }
}
