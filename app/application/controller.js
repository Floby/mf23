import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class ApplicationController extends Controller {
  @tracked theme = 'dark';
  @service auth;
  @service judge;

  switchTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
  }

  get profile() {
    return this.judge.getCurrent();
  }
}
