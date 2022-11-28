import { modifier } from 'ember-modifier';

export default modifier(function regionCss(element, [regionId] /*, named*/) {
  element.classList.add(regionId);
});
