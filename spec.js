var ok = require('assert').ok,
    browserify = require('browserify'),
    reactify = require('./index'),
    undoubted = require('./undoubted'),
    coffeeify = require('coffeeify');

describe('reactify', function() {
  var bundle = function(entry, cb) {
    return b = browserify(entry)
      .transform(coffeeify)
      .transform(reactify)
      .bundle(cb);
  };

  it('works for *.js with pragma', function(done) {
    return bundle('./fixtures/main.js', function(err, result) {
      ok(!err);
      ok(result);
      return done();
    });
  });

  it('works for *.jsx', function(done) {
    return bundle('./fixtures/main.jsx', function(err, result) {
      ok(!err);
      ok(result);
      return done();
    });
  });

  it('works for plain *.js', function(done) {
    return bundle('./fixtures/simple.js', function(err, result) {
      ok(!err);
      ok(result);
      return done();
    });
  });

  it('works for *.coffee', function(done) {
    return bundle('./fixtures/coffee.coffee', function(err, result) {
      ok(!err);
      ok(result);
      return done();
    });
  });

  it('returns error on invalid JSX', function(done) {
    return bundle('./fixtures/invalid.js', function(err, result) {
      ok(err);
      ok(!result);
      return done();
    });
  });

  return it('works for *.js without pragma when we ask it so', function(done) {
    return browserify('./fixtures/main.jsnox')
      .transform(undoubted)
      .bundle(function(err, result) {
        ok(!err);
        ok(result);
        return done();
      });
  });

});
