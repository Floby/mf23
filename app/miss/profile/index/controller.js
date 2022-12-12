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
    const highlightedJudgement = judgements
      .filter((j) => j.judge.nom === judge)
      .map((j) => ({ ...j, highlighted: true }));
    const otherJudgements = judgements
      .filter((j) => j.judge.nom !== judge)
      .sort((a, b) => b.createdAt - a.createdAt);
    return [...highlightedJudgement, ...otherJudgements];
  }
}
