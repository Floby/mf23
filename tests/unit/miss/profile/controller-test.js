import { module, test } from 'qunit';
import { setupTest } from 'mf23/tests/helpers';

module('Unit | Controller | miss/profile', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:miss/profile');
    assert.ok(controller);
  });
});
