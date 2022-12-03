import Controller from '@ember/controller';
import { resource } from 'mf23/resources';
import { service } from '@ember/service';

export default class MissProfileIndexController extends Controller {
  @service auth;

  constructor(...args) {
    super(...args);
  }

  @resource
  async panel() {
    const url = `/api/judge`;
    const token = this.auth.accessToken;
    const miss = this.model.miss;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    const panel = [];
    for (const judge of json) {
      if (judge.id === this.auth.userInfo.sub) {
        continue;
      }
      const judgement = judge.miss[miss.id];
      if (judgement) {
        panel.push({ ...judgement, judge: { nom: judge.nom } });
      }
    }
    return panel;
  }
}
