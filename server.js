'use strict';

var env = process.env.NODE_ENV || 'development';

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
container.register('appLogger', ['logger', require('./lib/logger')]);
require('./lib/service').register(container);

Promise.coroutine(function* () {
  try {
    var app = koa();

    if(env === 'development') {
      app.use(require('koa-livereload')());
    }

    var appLogger = yield container.resolve('appLogger');

    // log everything from here
    app.use(appLogger);

    var views = require('koa-views');
    var path = require('path');
    views = views(path.resolve(__dirname, 'view'), 'jade');
    app.use(views.use());

    container.register('api', require('./lib/api'));
    var api = yield container.resolve('api');
    app.use(mount('/api', api));

    // bounce favicon request
    app.use(favicon());

    container.register('landing', require('./lib/landing'));
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
    // var landing = yield container.resolve('landing');
    // app.use(landing);

    if(env === 'development') app.use(serve('build/'));
    else app.use(serve('dist/'));

    app.listen(8000);
    console.log('listening on port 8000');
  } catch(e) {
    logger.error(e);
  }

})();
