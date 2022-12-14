import { module, test } from 'qunit';
import { setupTest } from 'mf23/tests/helpers';

module('Unit | Controller | judges', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:judges');
    assert.ok(controller);
  });
});
