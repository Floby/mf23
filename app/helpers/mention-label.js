import { helper } from '@ember/component/helper';
import { Mentions } from '../models/mention';

export default helper(function mentionLabel(positional /*, named*/) {
  const [mention] = positional;
  return Mentions[mention][1];
});
