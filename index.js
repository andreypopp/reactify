"use strict";

var docblock  = require('jstransform/src/docblock');
var transform = require('jstransform').transform;
var visitors  = require('react-tools/vendor/fbtransform/visitors');
var through   = require('through');

var isJSXExtensionRe = /^.+\.jsx$/;

function parsePragma(data) {
  return docblock.parseAsObject(docblock.extract(data));
}

function process(file, isJSXFile, transformer) {
  transformer = transformer || transformJSX;

  var data = '';
  function write(chunk) {
    return data += chunk;
  }

  function compile() {
    // jshint -W040
    var isJSXPragma = parsePragma(data).jsx !== undefined;

    if (isJSXFile || isJSXPragma) {
      if (!isJSXPragma) {
        data = '/** @jsx React.DOM */' + data;
      }
      try {
        var transformed = transformer(data);
        this.queue(transformed);
      } catch (error) {
        this.emit('error', 'Error reactifying ' + file + ': ' + error);
      }
    } else {
      this.queue(data);
    }
    return this.queue(null);
    // jshint +W040
  }

  return through(write, compile);
}

function getExtensionsMatcher(extensions) {
  return new RegExp('\\.(' + extensions.join('|') + ')$');
}

function transformJSX(source) {
  var visitorList = visitors.transformVisitors.react;
  return transform(visitorList, source).code;
}

function transformWithES6(source) {
  var visitorList = visitors.getAllVisitors();
  return transform(visitorList, source).code;
}

module.exports = function(file, options) {
  options = options || {};

  var isJSXFile;

  if (options.everything) {

    isJSXFile = true;
  } else {

    var extensions = ['jsx']
      .concat(options.extension)
      .concat(options.x)
      .filter(Boolean)
      .map(function(ext) { return ext[0] === '.' ? ext.slice(1) : ext });

    isJSXFile = getExtensionsMatcher(extensions).exec(file);
  }

  var transformFunc = options.harmony || options.es6 ?
    transformWithES6 :
    transformJSX;

  return process(file, isJSXFile, transformFunc);
};
module.exports.process = process;
module.exports.isJSXExtensionRe = isJSXExtensionRe;
