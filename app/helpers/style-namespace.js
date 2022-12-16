import { helper } from '@ember/component/helper';
import podNames from 'ember-component-css/pod-names';

export default helper(function styleNamespace([componentName] /*, named*/) {
  if (typeof componentName === 'string') {
    const className = podNames[componentName];
    return className;
  }
});
