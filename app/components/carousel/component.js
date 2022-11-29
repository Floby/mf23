import Component from '@glimmer/component';
import { debounce } from 'typescript-debounce-decorator';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CarouselComponent extends Component {
  @tracked meter = '?/?';

  calculateMeter(el) {
    const total = Math.round(el.scrollWidth / el.clientWidth);
    const current = Math.floor(el.scrollLeft / el.clientWidth) + 1;
    this.meter = `${current}/${total}`;
  }

  @action
  onInsert(el) {
    this.updateMeter({ target: el });
  }

  @action
  @debounce(80)
  updateMeter(event) {
    this.calculateMeter(event.target);
  }
}
