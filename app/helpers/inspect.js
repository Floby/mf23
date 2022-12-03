import { helper } from '@ember/component/helper';

export default helper(function inspect([o] /*, named*/) {
  debugger;
  return console.dir(o);
});
