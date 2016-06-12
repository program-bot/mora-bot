const assert = require('assert');
const names = require('../build/npm-names');

describe('npm-names', function () {
  it('is an array', function () {
    assert(Array.isArray(names), 'is an array');
  });

  it('contains jquery', function () {
    assert(names.indexOf('jquery') > 0, 'cantains jquery');
  });

  it('has hella names', function () {
    assert(names.length > 260 * 1000, 'has hella names');
  });
});
