import Component from '@glimmer/component';
import { debounce } from 'typescript-debounce-decorator';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CarouselComponent extends Component {
  @tracked meter = '?/?';
  @tracked _hoverDirection = '';
  @tracked _mouseActive = false;

  get hoverDirection() {
    if (!this._mouseActive) return '';
    return this._hoverDirection;
  }

  calculateMeter(el) {
    const total = Math.round(el.scrollWidth / el.clientWidth);
    const current = Math.round(el.scrollLeft / el.clientWidth) + 1;
    this.meter = `${current}/${total}`;
  }

  @action
  navigateScroll(e) {
    const { ratio, wrapper, width } = this.#getDirection(e);
    if (ratio < 0.45) {
      wrapper.scrollBy(-1 * width, 0);
    } else if (ratio > 0.55) {
      wrapper.scrollBy(width, 0);
    }
  }

  #getDirection(e) {
    const root = e.target.closest('.scroller-root');
    const area = root.getBoundingClientRect();
    const x = e.clientX - area.left;
    const ratio = x / area.width;
    const wrapper = root.querySelector('.carousel-wrapper');
    return { ratio, wrapper, width: area.width };
  }

  @action
  mouseActive(active) {
    this._mouseActive = active;
  }

  @action
  mouseMove(e) {
    const { ratio } = this.#getDirection(e);
    if (ratio < 0.5) {
      this._hoverDirection = 'left';
    } else {
      this._hoverDirection = 'right';
    }
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
