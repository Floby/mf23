import { module, test } from 'qunit';
import { setupTest } from 'mf23/tests/helpers';

module('Unit | Controller | miss/top', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:miss/top');
    assert.ok(controller);
  });
});
