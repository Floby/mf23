import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class JudgesRoute extends Route {
  @service auth;
  @service panel;
  beforeModel() {
    if (!this.auth.isAuthenticated) {
      this.auth.login();
    }
  }

  async model() {
    const judges = await this.panel.getJudgesStats();
    return { judges };
  }
}
