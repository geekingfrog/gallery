'use strict';

module.exports = function landing(Promise, ponyService) {
  return function* (next) {
    if(this.url !== '/') {
      console.log('yielding to the next one');
      console.log(this.url);
      yield next();
    }
    try {
      console.log(this.url);
      var ponies = yield ponyService.findAll();
      console.log('rendering index.jade');
      this.body = yield this.render('index.jade', {ponies: ponies});
    } catch(e) {
      console.log('error');
      console.log(e);
    }
    // this.body = 'wut ?';
  }
}
