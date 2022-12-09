import Service from '@ember/service';
import { debounce } from 'typescript-debounce-decorator';
import { service } from '@ember/service';
import ms from 'ms';
import Store from 'store2';
import { tracked } from '@glimmer/tracking';
import Miss from '../models/miss';

export default class JudgeService extends Service {
  @service auth;
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
      avatar: this.auth.userInfo.picture,
      updatedAt: Date.now(),
    });
    this._current = judge;
    this.scheduleSync();
  }

  getCurrentJudgementFor(id) {
    const current = this.getCurrent();
    return current.miss[id];
  }

  @debounce(ms('5 second'))
  scheduleSync() {
    this.syncChanges();
  }

  async syncChanges() {
    if (!this.auth.isAuthenticated) return;
    const ifSince = new Date(this._current.updatedAt);
    try {
      const remote = await this.#getRemote();
      const { reconciled, localChanges, remoteChanges } = this.#reconcile(
        remote,
        this._current
      );
      if (remoteChanges) {
        this._current = reconciled;
        this.store.set('me', reconciled);
      }
      if (localChanges) {
        await fetch(`/api/judge/me`, {
          method: 'PUT',
          body: JSON.stringify(reconciled),
          headers: {
            Authorization: `Bearer ${this.auth.accessToken}`,
            'Content-Type': 'application/json',
            'If-Unmodified-Since': ifSince.toUTCString(),
          },
        });
      }
    } catch (e) {
      console.error('failed to synchronize judge', e);
    }
  }

  #reconcile(remote, local) {
    let localChanges = false;
    let remoteChanges = false;
    const misses = {};
    for (const miss of Miss.getAll()) {
      const localMiss = local.miss[miss.id];
      const remoteMiss = remote.miss[miss.id];
      if (localMiss) {
        if (remoteMiss) {
          if (remoteMiss.updatedAt < localMiss.updatedAt) {
            misses[miss.id] = localMiss;
            localChanges = true;
          } else {
            misses[miss.id] = remoteMiss;
            remoteChanges ||= remoteMiss.updatedAt !== localMiss.updatedAt;
          }
        } else {
          misses[miss.id] = localMiss;
          localChanges = true;
        }
      } else if (remoteMiss) {
        misses[miss.id] = remoteMiss;
        remoteChanges = true;
      }
    }
    const freshest = local.updatedAt > remote.updatedAt ? local : remote;
    const reconciled = {
      ...freshest,
      miss: misses,
    };
    localChanges = localChanges || freshest === local;
    remoteChanges = remoteChanges || freshest === remote;
    return { reconciled, localChanges, remoteChanges };
  }

  async #getRemote() {
    const res = await fetch(`/api/judge/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.auth.accessToken}`,
        Accept: 'application/json',
      },
    });
    const json = await res.json();
    return json;
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
