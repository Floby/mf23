import { modifier } from 'ember-modifier';
import autosize from 'autosize';

export default modifier(function inputAutosize(
  element /*, positional, named*/
) {
  autosize(element);
});
