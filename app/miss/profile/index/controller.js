import Controller from '@ember/controller';
import { resource } from 'mf23/resources';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MissProfileIndexController extends Controller {
  @service router;
  @service panel;
  @service auth;

  queryParams = [
    {
      preserveScrollPosition: {
        scope: 'controller',
      },
    },
    {
      judge: {
        scope: 'controller',
      },
    },
  ];

  @tracked preserveScrollPosition = null;
  @tracked judge = null;

  constructor(...args) {
    super(...args);
  }

  @resource
  async judgements() {
    const judge = this.judge;
    const judgements = await this.panel.getJudgementsForMiss(this.model.miss);
    const favs = {};
    for (const j of judgements) {
      const jFavs = j.favs || [];
      for (const f of jFavs) {
        favs[f] = favs[f] || { count: 0, names: [] };
        favs[f].count++;
        favs[f].names.push(j.judge.nom);
      }
    }
    const favved = judgements.map((j) => ({
      ...j,
      fav: favs[j.judge.id],
    }));
    const highlightedJudgement = favved
      .filter((j) => j.judge.nom === judge)
      .map((j) => ({ ...j, highlighted: true }));
    const otherJudgements = favved
      .filter((j) => j.judge.nom !== judge)
      .sort((a, b) => b.createdAt - a.createdAt);
    return [...highlightedJudgement, ...otherJudgements];
  }
}
