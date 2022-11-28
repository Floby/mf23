import { module, test } from 'qunit';
import { setupTest } from 'mf23/tests/helpers';

module('Unit | Service | judge', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:judge');
    assert.ok(service);
  });
});
