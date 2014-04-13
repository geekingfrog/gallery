'use strict';

module.exports = function(koa, koaTrieRouter, logger, ponyService) {

  var api = koa();
  api.use(koaTrieRouter(api));

  var node = api.route('/ponies').get(function* () {
    this.body = yield ponyService.findAll();
  });

  return api;
}
