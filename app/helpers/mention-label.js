import { helper } from '@ember/component/helper';
import { Mentions } from '../models/mention';

export default helper(function mentionLabel(positional /*, named*/) {
  const [m] = positional;
  return Mentions[Number(m)][1];
});
