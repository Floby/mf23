import Service, { service } from '@ember/service';
import percentile from 'percentile';
import Miss from '../models/miss';

export default class PanelService extends Service {
  @service auth;

  async getJudgementsForMiss(miss) {
    const json = await this.#getAll();
    const judgements = [];
    for (const judge of json) {
      if (judge.id === this.auth.userInfo.sub) {
        continue;
      }
      const judgement = judge.miss[miss.id];
      if (judgement) {
        judgements.push({ ...judgement, judge: { nom: judge.nom } });
      }
    }
    return judgements;
  }

  async getJudgesStats() {
    const json = await this.#getAll();
    const stats = json.map((j) => ({
      nom: j.nom,
      avatar: j.avatar,
      progress: Object.values(j.miss).length / Miss.getAll().length,
      median:
        Math.round(
          percentile(
            50,
            Object.values(j.miss).map((m) => m.mention)
          )
        ) || 0,
    }));
    console.log(stats);
    return stats;
  }

  async #getAll() {
    const url = `/api/judge`;
    const token = this.auth.accessToken;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    return json;
  }
}
