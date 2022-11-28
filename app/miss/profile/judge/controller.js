import Controller from '@ember/controller';
import { Mentions } from '../../../models/mention';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MissProfileJudgeController extends Controller {
  _model = null;
  @tracked mention = 0;
  @tracked comment = '';

  set model(judgement) {
    this._model = judgement;
    this.mention = judgement.mention;
    this.comment = judgement.comment;
  }
  get model() {
    return {
      mention: Number(this.mention),
      comment: this.comment,
    };
  }

  get mentions() {
    return Mentions.map((m, value) => ({
      value,
      reaction: m[0],
      label: m[1],
    }));
  }

  get currentMention() {
    return this.mentions[this.model.mention];
  }

  @action
  selectMention(index) {
    this.mention = index;
  }
}
