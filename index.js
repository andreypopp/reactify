var react = require('react-tools'),
    docblock = require('react-tools/vendor/fbtransform/lib/docblock'),
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
    var e, isJSXExtension, isJSXPragma, transformed;

    isJSXPragma = parsePragma(data).jsx != null;
    if (isJSXFile || isJSXPragma) {
      if (!isJSXPragma) {
        data = '/** @jsx React.DOM */' + data;
      }
      try {
        transformed = react.transform(data);
      } catch (_error) {
        e = _error;
        this.emit('error', e);
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
