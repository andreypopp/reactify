var jstransform = require('jstransform'),
    visitors = require('react-tools/vendor/fbtransform/visitors').transformVisitors,
    docblock = require('jstransform/src/docblock'),
    through = require('through');

var isJSXExtensionRe = /^.+\.jsx$/;

function parsePragma(data) {
  return docblock.parseAsObject(docblock.extract(data));
}

function process(file, isJSXFile) {
  var data = '';
  function write(chunk) {
    return data += chunk;
  }

  function compile() {
    var isJSXExtension, isJSXPragma, transformed;

    isJSXPragma = parsePragma(data).jsx != null;
    if (isJSXFile || isJSXPragma) {
      if (!isJSXPragma) {
        data = '/** @jsx React.DOM */' + data;
      }
      try {
        transformed = jstransform.transform(visitors.react, data).code;
      } catch (error) {
        this.emit('error', error);
      }
      this.queue(transformed);
    } else {
      this.queue(data);
    }
    return this.queue(null);
  }

  return through(write, compile);
}

module.exports = function(file) {
  return process(file, isJSXExtensionRe.exec(file));
};
module.exports.process = process;
