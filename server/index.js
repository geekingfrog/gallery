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
container.registerAndExport('fs', Promise.promisifyAll(require('fs')));

Promise.coroutine(function* () {
  try {
    yield container.scan(['server/lib/**/*.js']);

    var app = koa();
    logger.info('app.env: %s', app.env);

    if(app.env === 'development') {
      app.use(require('koa-livereload')());
    }

    var appLogger = yield container.resolve('appLogger');

    // log everything from here
    app.use(appLogger);

    var api = yield container.resolve('api');
    app.use(mount('/api', api));

    // bounce favicon request
    app.use(favicon());

    var router = yield container.resolve('koaTrieRouter');
    app.use(router(app));
    var ponyService = yield container.resolve('ponyService');


    app.route('/').get(function* () {
      try {
        console.log(this.url);
        var ponies = yield ponyService.findAll();
        console.log('rendering index.jade');
        console.dir(ponies);

        this.body = yield this.render('index.jade', {ponies: ponies});
      } catch(e) {
        console.log('error');
        console.log(e);
      }

    });

    if(app.env === 'development') app.use(serve('build/'));
    else app.use(serve('dist/'));

    app.listen(8000);
    logger.info('listening on port 8000');
  } catch(e) {
    logger.error(e.stack || e);
  }

})();
