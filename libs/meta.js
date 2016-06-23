const Conf = require('conf');

module.exports = new Conf({
  configName: 'meta',
  cwd: require('path').resolve(__dirname, '..')
})

