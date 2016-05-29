import test from 'ava';
import assert from 'assert';

const names = require('../build/npm-names');

test('npm-names', t => {
  assert(Array.isArray(names), 'is an array');
  assert(names.length > 260 * 1000, 'has hella names');
  t.pass();
});
