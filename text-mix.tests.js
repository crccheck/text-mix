var textMix = require('./text-mix'),
    assert = require('assert');


describe('TextMix', function () {
  it('identity test', function() {
    assert.equal(textMix.traverse('hello', 'hello', 0), 'hello');
  });

  it('can traverse a path', function() {
    assert.equal(textMix.traverse('kitten','sitting', 0), 'sitting');
    assert.equal(textMix.traverse('kitten','sitting', 1), 'sittin');
    // assert.equal(textMix.traverse('kitten','sitting', 2), 'sittin');
    assert.equal(textMix.traverse('kitten','sitting', 2), 'sitten');
    // assert.equal(textMix.traverse('kitten','sitting', 4), 'sitten');
    // assert.equal(textMix.traverse('kitten','sitting', 5), 'sitten');
    // assert.equal(textMix.traverse('kitten','sitting', 6), 'sitten');
    assert.equal(textMix.traverse('kitten','sitting', 3), 'kitten');
    // assert.equal(textMix.traverse('kitten','sitting', 8), 'kitten');
  });

  it('can traverse another path', function() {
    assert.equal(textMix.traverse('elvis', 'washington', 0), 'washington');
    assert.equal(textMix.traverse('washington', 'elvis', 0), 'elvis');
    assert.equal(textMix.traverse('washington', 'elvis', 9), 'washington');
    assert.equal(textMix.traverse('elvis', 'washington', 9), 'elvis');
  });
});
