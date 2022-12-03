import { helper } from '@ember/component/helper';

export default helper(function boringAvatar([nom] /*, named*/) {
  const colors = ['5faeae', 'F0F5F5', '4D8399', 'f0c8c8'];
  return `http://source.boringavatars.com/beam/240/${nom}?colors=${colors.join(',')}`;
});
