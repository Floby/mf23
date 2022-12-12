import Component from '@glimmer/component';
import { debounce } from 'typescript-debounce-decorator';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ms from 'ms';

export default class HeightAdjustComponent extends Component {
  @tracked height;

  @action
  @debounce(ms('800ms'))
  onResize(entry, observer) {
    this.height = `${entry.contentRect.height}px`;
  }
}
