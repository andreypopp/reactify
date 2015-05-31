/**
 * Reactify — a Browserify transform for JSX (a superset of JS used by React.js)
 */
"use strict";

var ReactTools = require('react-tools');
var through    = require('through');
var minimatch  = require('minimatch');
var path       = require('path')

function reactify(filename, options) {
  options = options || {};

  var exclude = computeExcluded(options.exclude);
  var buf = [];

  function write(chunk) {
    if (!Buffer.isBuffer(chunk)) {
      chunk = new Buffer(chunk)
    }
    return buf.push(chunk)
  }

  function compile() {
    var source = Buffer.concat(buf).toString();
    // jshint -W040
    if (isJSXFile(filename, exclude, options)) {
      try {
        var output = ReactTools.transform(source, {
          es5: options.target === 'es5',
          sourceMap: true,
          sourceFilename: filename,
          stripTypes: options['strip-types'] || options.stripTypes,
          harmony: options.harmony || options.es6
        });
        this.queue(output);
      } catch (error) {
        error.name = 'ReactifyError';
        error.message = filename + ': ' + error.message;
        error.fileName = filename;
        this.emit('error', error);
      }
    } else {
      this.queue(source);
    }
    return this.queue(null);
    // jshint +W040
  }

  return through(write, compile);
}

function isJSXFile(filename, exclude, options) {
  var relativeName = path.relative(process.cwd(), filename);

  if (exclude.some(function(matcher) {
    return matcher.match(relativeName);
  })) {
    return false;
  }

  if (options.everything) {
    return true;
  } else {
    var extensions = ['js', 'jsx']
      .concat(options.extension)
      .concat(options.x)
      .filter(Boolean)
      .map(function(ext) { return ext[0] === '.' ? ext.slice(1) : ext });
    return new RegExp('\\.(' + extensions.join('|') + ')$').exec(filename);
  }
}

function computeExcluded(excluded) {
  if (!excluded) {
    return [];
  }

  return (Array.isArray(excluded) ? excluded : [excluded]).map(function (pattern) {
    return minimatch.Minimatch(pattern);
  });
}

module.exports = reactify;
