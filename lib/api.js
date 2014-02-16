'use strict';

module.exports = function(koa, koaTrieRouter, logger, ponyService) {

  var api = koa();
  api.use(koaTrieRouter(api));

  var node = api.route('/test').get(function* () {
    logger.debug(arguments);
    this.body = yield ponyService.findAll();
  });

  return api;
}
