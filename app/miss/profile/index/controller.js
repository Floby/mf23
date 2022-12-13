import Controller from '@ember/controller';
import { resource } from 'mf23/resources';
import { service } from '@ember/service';
import { tracked, cached } from '@glimmer/tracking';

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


  get favs() {
    const judgements = this.judgements;
    if (!judgements) {
      return {};
    }
    const favs = {};
    for (const j of judgements) {
      const jFavs = j.favs || [];
      for (const f of jFavs) {
        favs[f] = favs[f] || 0;
        favs[f]++;
      }
    }
    return favs;
  }

  get ownFavs() {
    return (this.model.judgement.favs || []).reduce(
      (favs, id) => ({
        ...favs,
        [id]: 1,
      }),
      {}
    );
  }

  get judgements() {
    const judge = this.judge;
    const judgements = this.model.judgements;

    const highlightedJudgement = judgements
      .filter((j) => j.judge.nom === judge)
      .map((j) => ({ ...j, highlighted: true }));

    const otherJudgements = judgements
      .filter((j) => j.judge.nom !== judge)
      .sort((a, b) => b.createdAt - a.createdAt);

    return [...highlightedJudgement, ...otherJudgements];
  }
}
