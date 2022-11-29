import { helper } from '@ember/component/helper';
import { Mentions } from '../models/mention';

export default helper(function mentionEmoji(positional /*, named*/) {
  const [mention] = positional;
  return Mentions[mention] ? Mentions[mention][0] : undefined;
});
