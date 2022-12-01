import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ProfileRoute extends Route {
  @service auth;
  async beforeModel(transition) {
    try {
      await this.auth.tryToAuthenticate(transition.to.queryParams || {});
    } catch (error) {
      alert('Désolé, mais erreur de login');
      console.error(error);
      this.transitionTo('index');
    }
  }

  async model() {
    if (this.auth.userInfo) {
      return JSON.stringify(this.auth.userInfo, null, '  ');
    }
    return this.auth.login();
  }

  @action
  logout () {
    this.auth.logout();
  }

  @action
  async refreshLogin() {
    await this.auth.login();
  }
}
