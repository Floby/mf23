import { modifier } from 'ember-modifier';

/**
 * @param {Element} [element] The DOM element this modifier is applied to
 * @param {[Function, MutationObserverInit]} [params] Positional modifier params
 * @param {MutationObserverInit} [optionsHash] Hash modifier params; used as options to MutationObserver
 */
function observeMutation(
  element,
  [changeHandler, optionsParam = {}],
  optionsHash = {}
) {
  const options = {
    subtree: true,
    childList: true,
    attributes: true,
    ...optionsParam,
    ...optionsHash,
  };

  const observer = new MutationObserver(changeHandler.bind(null, element));
  observer.observe(element, options);

  return function () {
    observer.disconnect();
  };
}

export default modifier(observeMutation);
