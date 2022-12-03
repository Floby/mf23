import { helper } from '@ember/component/helper';
import Marked from 'marked';

export default helper(function markdown([content] /*, named*/) {
  return Marked.parse(content);
});
