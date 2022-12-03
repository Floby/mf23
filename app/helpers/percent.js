import { helper } from '@ember/component/helper';

export default helper(function percent([value] /*, named*/) {
  return `${Math.round(value * 100)}%`;
});
