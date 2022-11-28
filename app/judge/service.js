import Service from '@ember/service';
import Store from 'store2';

export default class JudgeService extends Service {
  constructor(...args) {
    super(...args);
    this.store = Store.namespace('judge').namespace('v1');
  }
  getCurrent() {
    const current = this.store.get('me') || initialJudge();
    return current;
  }
  saveCurrent(judge) {
    this.store.set('me', judge);
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
