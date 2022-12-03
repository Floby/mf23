import Controller from '@ember/controller';
import { Mentions } from '../../../models/mention';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MissProfileJudgeController extends Controller {
  @tracked _model = null;
  @tracked mention = 0;
  @tracked comment = '';

  set model(judgement) {
    this._model = judgement || {
      createdAt: Date.now(),
      mention: 2,
      comment: '',
    };
    this.mention = this._model.mention;
    this.comment = this._model.comment;
  }
  get newModel() {
    return {
      ...this._model,
      mention: Number(this.mention),
      comment: this.comment,
    };
  }

  get mentions() {
    return Mentions.map((_, value) => value);
  }

  @action
  selectMention(index) {
    this.mention = Number(index);
  }
}
