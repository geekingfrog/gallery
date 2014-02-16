var assert = require('chai').assert;
var Promise = require('bluebird');
Promise.onPossiblyUnhandledRejection(function(){});

var fs = Promise.promisifyAll(require('fs'));
var _ = require('lodash');
var gm = require('gm');
var path = require('path');

var service = require('../lib/ponyService')(Promise, _, gm, fs, path);

var itco = function(name, fn) {
  return it(name, function(done) {
    Promise.coroutine(fn)(done).catch(done);
  });
}

describe('basic service test', function() {

  // before(function(done) {
  //   Promise.spawn(function* () {
  //     service = yield Promise.try(require('../lib/ponyService').fn(Promise, _, gm, fs, path));
  //     console.log('before');
  //     done()
  //   }).catch(done);
  // });


  itco('findAll', function* (done) {
    var ponies = yield service.findAll();
    assert.lengthOf(ponies, 24);
    done();
  });

  describe('findById', function() {

    itco('invalid id throw error', function* (done) {
      try {
        yield service.findById('doesn\'t exist');
        done(new Error('should throw'));
      } catch(e) {
        done();
      }
    });

    itco('valid id return the object', function* (done) {
      var id = 'pinkiePie2.png';
      var pony = yield service.findById(id);
      assert.equal(pony.name, 'pinkiePie');
      done();
    });

  });

});
