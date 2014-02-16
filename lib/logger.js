// middleware to log the requests

module.exports = function(logger) {
// module.exports.name = 'app-logger';
// module.exports.dependencies = ['logger'];
// module.exports.define = function(logger) {
  var time = function(t) {
    if(t>1000) {
      return Math.round(t/1000)+'s';
    } else {
      return t+'ms';
    }
  }

  var logMsg = function(method, url, status, t) {
    return method+' '+url+' '+status+' '+time(t);
  }

  return function* appLogger(next) {
    var start = Date.now();

    try {
      yield next;
      logger.debug(logMsg(
        this.method,
        this.originalUrl,
        this.status,
        Date.now() - start
      ));

    } catch(err) {
      var delta = Date.now() - start;
      logger.error(logMsg(
        this.method,
        this.originalUrl,
        err.status,
        Date.now() - start
      ));
    }
  }
}
