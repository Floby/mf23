import { modifier } from 'ember-modifier';

export default modifier(function cssVar(element, positional, named) {
  for (const key in named) {
    element.style.setProperty(`--${key}`, named[key]);
  }
});
