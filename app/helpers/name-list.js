import { helper } from '@ember/component/helper';

export default helper(function nameList(positional /*, named*/) {
  const names = positional
    .flatMap((n) => n)
    .reverse()
    .filter(Boolean);
  if (!names.length) {
    return 'personne';
  }
  const [last, beforeLast, ...rest] = names;
  if (!beforeLast) {
    return last;
  }
  const end = [beforeLast, last].join(' et ');
  const list = rest.join(', ');
  return list ? [list, end].join(', ') : end;
});
