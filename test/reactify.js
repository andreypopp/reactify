/*jshint node: true*/
"use strict";
var assert      = require('assert');
var browserify  = require('browserify');
var coffeeify   = require('coffeeify');
var reactify    = require('../index');
var path        = require("path");

var sourceMapsRegex = /\/\/# sourceMappingURL=data:application\/json;base64,([a-zA-Z0-9+\/=]+)/;

describe('reactify', function() {

  function bundle(entry, cb) {
    return browserify(entry, {basedir: __dirname})
      .transform(coffeeify)
      .transform(reactify)
      .bundle({debug: true}, cb);
  };

  function normalizeWhitespace(src) {
    return src.replace(/\n/g, '').replace(/\r/g, '').replace(/ +/g, '');
  }

  function assertContains(bundle, code) {
    code = normalizeWhitespace(code);
    bundle = normalizeWhitespace(bundle);
    assert(bundle.indexOf(code) > -1, "bundle does not contain: " + code);
  }

  it('works for *.js with pragma', function(done) {
    bundle('./fixtures/main.js', function(err, result) {
      assert(!err);
      assert(result);
      assertContains(result, 'React.createElement("h1", null, "Hello, world!")');
      done();
    });
  });

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
      assertContains(String(err), 'Parse Error: Line 6: Unexpected token');
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

  it('strips cwd() from source-mapped paths', function(done) {
    browserify('./fixtures/main.jsx', {basedir: __dirname})
      .transform({"relative-source-maps": true}, reactify)
      .bundle({debug: true}, function(err, result) {
        assert(!err);
        assert(result);
        result = sourceMapsRegex.exec(result);
        assert(result);
        assert(result[1]);
        var sourceMap = new Buffer(result[1], 'base64').toString('ascii');
        var fullPath = '"' + path.normalize('test/fixtures/main.jsx').replace(/\\/g, '\\\\') + '"';
        assertContains(sourceMap, fullPath);
        done();
      });
  });

  it('strips basedir from source-mapped paths when provided', function(done) {
    browserify('./fixtures/main.jsx', {basedir: __dirname})
      .transform({"relative-source-maps": true, "basedir": path.join(__dirname, 'test')}, reactify)
      .bundle({debug: true}, function(err, result) {
        assert(!err);
        assert(result);
        result = sourceMapsRegex.exec(result);
        assert(result);
        assert(result[1]);
        var sourceMap = new Buffer(result[1], 'base64').toString('ascii');
        var fullPath = '"' + path.normalize('../fixtures/main.jsx').replace(/\\/g, '\\\\') + '"';
        assertContains(sourceMap, fullPath);
        done();
      });
  });

  describe('transforming files with extensions other than .js/.jsx', function() {

    it('activates via extension option', function(done) {
      browserify('./fixtures/main.jsnox', {basedir: __dirname})
        .transform({extension: 'jsnox'}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'React.createElement("h1", null, "Hello, world!")');
          done();
        });
    });

    it('activates via x option', function(done) {
      browserify('./fixtures/main.jsnox', {basedir: __dirname})
        .transform({x: 'jsnox'}, reactify)
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
        .transform({'strip-types': true}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'var x = 1; function y(param) { return 1; }');
          done();
        });
    });

    it('activates via "stripTypes" option', function(done) {
      browserify('./fixtures/main.strip-types.js', {basedir: __dirname})
        .transform({stripTypes: true}, reactify)
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
