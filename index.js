'use strict';

var serve = require('koa-static');
var favicon = require('koa-favicon');
var Promise = require('bluebird');
Promise.longStackTraces();

var koa = require('koa');
var mount = require('koa-mount');

var logger = require('log4js').getLogger('[galery]');
var Container = require('zeninjector');
var container = new Container({
  logger: logger
});

// define some npm module
container.registerAndExport('koa', koa);
container.registerAndExport('koaTrieRouter', require('koa-trie-router'));

container.registerAndExport('Promise', require('bluebird'));
container.registerAndExport('gm', require('gm'));
container.registerAndExport('_', require('lodash'));
container.registerAndExport('path', require('path'));

container.registerAndExport('logger', logger);
container.register('appLogger', require('./lib/logger'));
require('./lib/service').register(container);

Promise.spawn(function* () {
  try {
    var app = koa();
    var appLogger = yield container.resolve('appLogger');

    // api definition
    // var api = koa();
    // api.use(require('koa-trie-router')(api))
    //
    // var node = api.route('/test').get(function* () {
    //   logger.debug(arguments);
    //   this.body = 'foobared !';
    // });

    container.register('api', require('./lib/api'));
    var api = yield container.resolve('api');
    app.use(mount('/api', api));


    // bounce favicon request
    app.use(favicon());

    // log everything from here
    app.use(appLogger);

    app.use(serve('static/'));

    app.listen(8000);
    console.log('listening on port 8000');
  } catch(e) {
    logger.error(e.message);
    logger.error(e.stack);
  }

});


