import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class ApplicationController extends Controller {
  @tracked theme = 'dark';
  @service auth;

  switchTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
  }
}
