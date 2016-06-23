const Conf = require('conf');

module.exports = new Conf({
  configName: 'meta',
  cwd: require('path').join(__dirname, '..')
})

