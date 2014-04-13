'use strict';
var Promise = require('bluebird');

module.exports.register = function(container) {
  container.registerAndExport('fs', Promise.promisifyAll(require('fs')));

  container.register('ponyService', require('./ponyService'));
}
