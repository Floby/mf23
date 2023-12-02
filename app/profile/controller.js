import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ProfileController extends Controller {
  @service auth;
  @service judge;

  @tracked _model;
  set model(model) {
    this._model = model;
    if (!this.nom || this.nom === 'Inconnu') {
      const m = model;
      this.nom = m.given_name || m.nickname || m.name;
    }
  }
  get model() {
    return this._model;
  }

  @tracked _nom = null;

  get nom() {
    return this._nom || this.judge._current.nom;
  }
  set nom(nom) {
    const judge = this.judge.getCurrent();
    judge.nom = nom;
    this._nom = nom;
    this.judge.saveCurrent(judge);
  }

  @tracked _autoAvatar = null;
  get autoAvatar() {
    return this._autoAvatar || this.judge._current.autoAvatar;
  }
  set autoAvatar(value) {
    const judge = this.judge.getCurrent();
    console.log(value);
    judge.autoAvatar = value;
    this.judge.saveCurrent(judge);
  }
}
