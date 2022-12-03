import { TrackedObject } from 'tracked-built-ins';

export function resource(target, name, descriptor) {
  const original = descriptor.value || descriptor.get ;
  if (typeof original !== 'function') {
    throw Error('@resource should be applied on a function');
  }
  const getter = original;
  let controller = null;
  const state = new TrackedObject({
    loading: false,
    resolved: false,
    settled: false,
    error: null,
    value: null,
  });

  reset();
  return {
    get: getResource,
    configurable: true,
    enumerable: false
  }

  function getResource() {
    reset();
    doFetch(this);
    return state;
  }

  async function doFetch(self) {
    state.loading = true;
    try {
      const value = await getter.call(self);
      state.value = value;
      state.settled = true;
      state.resolved = true;
    } catch (error) {
      state.loading = false;
      state.resolved = false;
      state.settled = true;
      state.error = error;
    }
  }

  function reset() {
    if (controller) {
      controller.signal();
    }
    controller = null;
    state.value = null;
    state.error = null;
    state.settled = false;
    state.loading = false;
    state.resolved = false;
  }
}
