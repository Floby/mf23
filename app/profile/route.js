import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ProfileRoute extends Route {
  @service auth;
  async beforeModel(transition) {
    try {
      const afterLogin = await this.auth.tryToAuthenticate(
        transition.to.queryParams || {}
      );
      if (afterLogin) {
        this.transitionTo(afterLogin);
      }
    } catch (error) {
      alert('Désolé, mais erreur de login');
      console.error(error);
      this.transitionTo('index');
    }
    if (!this.auth.isAuthenticated) {
      return this.auth.login(transition.to.queryParams?.afterLogin);
    }
  }

  async model() {
    if (this.auth.userInfo) {
      return this.auth.userInfo;
    }
  }

  @action
  logout() {
    this.auth.logout();
  }

  @action
  async refreshLogin() {
    await this.auth.login();
  }

  @action
  async refreshToken() {
    await this.auth.refresh();
  }
}
