// middleware to log the requests
'use strict';

module.exports = function(logger) {
// module.exports.name = 'app-logger';
// module.exports.dependencies = ['logger'];
// module.exports.define = function(logger) {
  let time = function(t) {
    if(t>1000) {
      return Math.round(t/1000)+'s';
    } else {
      return t+'ms';
    }
  }

  let logMsg = function(method, url, status, t) {
    return method+' '+url+' '+status+' '+time(t);
  }

  return function* appLogger(next) {
    let start = Date.now();

    try {
      yield next;
      logger.debug(logMsg(
        this.method,
        this.originalUrl,
        this.status,
        Date.now() - start
      ));

    } catch(err) {
      let delta = Date.now() - start;
      let status;
      try {
        status = parseInt(err.status);
      } catch(err) {
        status = 500;
      }

      let method = status < 500 ? 'debug' : 'error';
      logger[method](logMsg(
        this.method,
        this.originalUrl,
        err.status,
        Date.now() - start
      ));
    }
  }
}
