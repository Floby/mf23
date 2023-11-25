import { helper } from '@ember/component/helper';

export default helper(function safeGet([target, key] /*, named*/) {
  return target[key];
});
