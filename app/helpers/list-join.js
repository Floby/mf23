import { helper } from '@ember/component/helper';

export default helper(function listJoin([list] /*, named*/) {
  return list.join(',');
});
