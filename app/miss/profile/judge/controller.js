import Controller from '@ember/controller';
import { Mentions } from '../../../models/mention';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MissProfileJudgeController extends Controller {
  @tracked mention = 2;

  get mentions() {
    return Mentions.map((m, value) => ({
      value,
      reaction: m[0],
      label: m[1],
    }));
  }

  get currentMention() {
    return this.mentions[this.mention];
  }

  @action
  selectMention(index) {
    this.mention = index;
  }
}
