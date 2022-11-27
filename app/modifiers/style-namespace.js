import { modifier } from 'ember-modifier';
import podNames from 'ember-component-css/pod-names';

export default modifier(function styleNamespace(
  element,
  [componentName] /*, positional, named*/
) {
  if (typeof componentName === 'string') {
    const className = podNames[componentName];
    element.classList.add(className);
  }
});
