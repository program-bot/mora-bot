const path = require('path');

const meta = require('file-setting')(path.join(__dirname, '..', 'meta.json'));

meta.initSync();


module.exports = {
  set: meta.setSync.bind(meta),
  get: meta.getSync.bind(meta)
};
