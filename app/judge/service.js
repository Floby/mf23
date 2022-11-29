import Service from '@ember/service';
import Store from 'store2';
import { tracked } from '@glimmer/tracking';

export default class JudgeService extends Service {
  constructor(...args) {
    super(...args);
    this.store = Store.namespace('judge').namespace('v1');
  }

  @tracked _current;

  getCurrent() {
    const current = this.store.get('me') || initialJudge();
    this._current = current;
    return this._current;
  }
  saveCurrent(judge) {
    this.store.set('me', judge);
    this._current = judge;
  }

  getCurrentJudgementFor(id) {
    const current = this.getCurrent();
    return current.miss[id];
  }
}

function initialJudge() {
  return {
    nom: 'Inconnu',
    miss: {},
  };
}
