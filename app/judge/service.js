import Service from '@ember/service';
import Store from 'store2';
import { tracked } from '@glimmer/tracking';

export default class JudgeService extends Service {
  constructor(...args) {
    super(...args);
    const schemaVersion = 2;
    this.migrateTo(schemaVersion);
    this.store = this.getStore(schemaVersion);
  }

  getStore(schemaVersion) {
    return Store.namespace('judge').namespace(`v${schemaVersion}`);
  }

  @tracked _current;

  getCurrent() {
    const current = this.store.get('me') || initialJudge();
    this._current = current;
    return this._current;
  }
  saveCurrent(judge) {
    this.store.set('me', {
      ...judge,
      updatedAt: Date.now(),
    });
    this._current = judge;
  }

  getCurrentJudgementFor(id) {
    const current = this.getCurrent();
    return current.miss[id];
  }

  migrateTo(target) {
    const migrationStore = Store.namespace('judge').namespace('schemaVersion');
    let current = migrationStore.get('current');
    while (current < target) {
      const migrationName = `migrate_${current}_to_${current + 1}`;
      if (typeof this[migrationName] === 'function') {
        this[migrationName]();
      }
      current++;
    }
    migrationStore.set('current', current);
  }

  migrate_1_to_2() {
    const v1 = this.getStore(1);
    const v2 = this.getStore(2);
    const judge = v1.get('me');
    if (!judge) {
      return;
    }

    judge.updatedAt = Date.now();
    for (const miss of Object.values(judge.miss)) {
      miss.createdAt = Date.now();
      miss.updatedAt = Date.now();
      miss.version = 1;
    }
    v2.set('me', judge);
  }
}

function initialJudge() {
  return {
    nom: 'Inconnu',
    miss: {},
  };
}
