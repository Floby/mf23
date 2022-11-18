import { module, test } from 'qunit';
import { setupTest } from 'mf23/tests/helpers';

module('Unit | Route | miss/index', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:miss/index');
    assert.ok(route);
  });
});
