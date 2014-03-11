var assert      = require('assert');
var browserify  = require('browserify');
var coffeeify   = require('coffeeify');
var reactify    = require('../index');

describe('reactify', function() {

  function bundle(entry, cb) {
    return b = browserify(entry, {basedir: __dirname})
      .transform(coffeeify)
      .transform(reactify)
      .bundle(cb);
  };

  it('works for *.js with pragma', function(done) {
    return bundle('./fixtures/main.js', function(err, result) {
      assert(!err);
      assert(result);
      return done();
    });
  });

  it('works for *.jsx', function(done) {
    return bundle('./fixtures/main.jsx', function(err, result) {
      assert(!err);
      assert(result);
      return done();
    });
  });

  it('works for plain *.js', function(done) {
    return bundle('./fixtures/simple.js', function(err, result) {
      assert(!err);
      assert(result);
      return done();
    });
  });

  it('works for *.coffee', function(done) {
    return bundle('./fixtures/coffee.coffee', function(err, result) {
      assert(!err);
      assert(result);
      return done();
    });
  });

  it('returns error on invalid JSX', function(done) {
    return bundle('./fixtures/invalid.js', function(err, result) {
      assert(err);
      assert(!result);
      return done();
    });
  });

  return it('works for *.js without pragma when we ask it so', function(done) {
    return browserify('./fixtures/main.jsnox', {basedir: __dirname})
      .transform({extension: 'jsnox'}, reactify)
      .bundle(function(err, result) {
        assert(!err);
        assert(result);
        return done();
      });
  });

});
