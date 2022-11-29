import { helper } from '@ember/component/helper';
import { Mentions } from '../models/mention';

export default helper(function mentionEmoji(positional /*, named*/) {
  const [m] = positional;
  return Mentions[Number(m)] ? Mentions[Number(m)][0] : undefined;
});
