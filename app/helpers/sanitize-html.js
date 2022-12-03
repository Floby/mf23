import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';
import Sanitize from 'sanitize-html';

export default helper(function sanitizeHtml([html] /*, named*/) {
  const sane = Sanitize(html, {
    allowedTags: Sanitize.defaults.allowedTags.filter(
      (tag) => tag !== 'img' && !tag.startsWith('h')
    ),
  });
  return htmlSafe(sane);
});
