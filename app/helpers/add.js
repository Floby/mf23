import { helper } from '@ember/component/helper';

export default helper(function add(terms /*, named*/) {
  return terms.reduce((sum, term) => sum + term, 0);
});
