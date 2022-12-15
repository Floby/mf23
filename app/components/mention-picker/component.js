import Component from '@glimmer/component';
import { Mentions } from '../../models/mention';
import { action } from '@ember/object';

export default class MentionPickerComponent extends Component {
  get mentions() {
    return Mentions.map((_, value) => value);
  }

  @action
  selectMention(mention) {
    this.args.onChange(mention);
  }
}
