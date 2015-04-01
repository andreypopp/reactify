var assert      = require('assert');
var browserify  = require('browserify');
var coffeeify   = require('coffeeify');
var reactify    = require('../index');

describe('reactify', function() {

  function bundle(entry, cb) {
    return browserify(entry, {
      basedir: __dirname,
      debug: true
    })
    .transform(coffeeify)
    .transform(reactify)
    .bundle(cb);
  };

  function normalizeWhitespace(src) {
    return src.replace(/\n/g, '').replace(/\r/g, '').replace(/ +/g, '');
  }

  function assertContains(bundle, code) {
    code = normalizeWhitespace(code);
    bundle = normalizeWhitespace(bundle.toString());
    assert(bundle.indexOf(code) > -1, "bundle does not contain: " + code);
  }

  it('works for *.jsx', function(done) {
    bundle('./fixtures/main.jsx', function(err, result) {
      assert(!err);
      assert(result);
      assertContains(result, 'React.createElement("h1", null, "Hello, world!")');
      done();
    });
  });

  it('works for plain *.js', function(done) {
    bundle('./fixtures/simple.js', function(err, result) {
      assert(!err);
      assert(result);
      assertContains(result, 'React.createElement("h1", null, "Hello, world!")');
      done();
    });
  });

  it('returns error on invalid JSX', function(done) {
    bundle('./fixtures/invalid.js', function(err, result) {
      assert(err);
      console.log(String(err));
      assertContains(String(err), 'ParseError: Unexpected token');
      assert(!result);
      done();
    });
  });

  it('includes embedded source map', function(done) {
    bundle('./fixtures/main.jsx', function(err, result) {
      assert(!err);
      assert(result);
      assertContains(result, '//# sourceMappingURL=data:application/json;base64');
      done();
    });
  });

  describe('transforming files with extensions other than .js/.jsx', function() {

    it('activates via extension option', function(done) {
      browserify('./fixtures/main.jsnox', {basedir: __dirname})
        .transform({extensions: [ '.jsnox' ]}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'React.createElement("h1", null, "Hello, world!")');
          done();
        });
    });

    it('activates via everything option', function(done) {
      browserify('./fixtures/main.jsnox', {basedir: __dirname})
        .transform({everything: true}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'React.createElement("h1", null, "Hello, world!")');
          done();
        });
    });

  });

  describe('transforming with es6 visitors', function() {

    it('activates via es6 option', function(done) {
      browserify('./fixtures/main.es6.jsx', {basedir: __dirname})
        .transform({es6: true}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'var func = function(x)  {return React.createElement("div", null, x)');
          done();
        });
    });

    it('activates via harmony option', function(done) {
      browserify('./fixtures/main.es6.jsx', {basedir: __dirname})
        .transform({harmony: true}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'var func = function(x)  {return React.createElement("div", null, x)');
          done();
        });
    });

  });

  describe('transforming with es5 as a target', function() {

    it('activates via target option', function(done) {
      browserify('./fixtures/main.es6-target-es5.jsx', {basedir: __dirname})
        .transform({es6: true, target: 'es5'}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, ' Object.defineProperty(Foo.prototype,"bar",{configurable:true,get:function() {"use strict";');
          done();
        });
    });

  });

  describe('stripping types', function() {

    it('activates via "strip-types" option', function(done) {
      browserify('./fixtures/main.strip-types.js', {basedir: __dirname})
        .transform({'strip-types': true, extensions: [ '.js' ]}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'var x = 1; function y(param) { return 1; }');
          done();
        });
    });

    it('activates via "stripTypes" option', function(done) {
      browserify('./fixtures/main.strip-types.js', {basedir: __dirname})
        .transform({stripTypes: true, extensions: [ '.js' ]}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'var x = 1; function y(param) { return 1; }');
          done();
        });
    });

  });

  describe('stripping types and transform with es6 visitors', function() {

    it('activates via "stripTypes" and "es6" option', function(done) {
      browserify('./fixtures/main.strip-types-es6.jsx', {basedir: __dirname})
        .transform({stripTypes: true, es6: true}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'function Foo(){"use strict";}');
          done();
        });
    });

  });

});
