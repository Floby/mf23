import { module, test } from 'qunit';
import { setupTest } from 'mf23/tests/helpers';

module('Unit | Service | panel', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:panel');
    assert.ok(service);
  });
});
