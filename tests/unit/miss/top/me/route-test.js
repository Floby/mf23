import { module, test } from 'qunit';
import { setupTest } from 'mf23/tests/helpers';

module('Unit | Route | miss/top/me', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:miss/top/me');
    assert.ok(route);
  });
});
