var docblock = require('jstransform/src/docblock'),
    transform = require('react-tools').transform,
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
    var isJSXPragma = parsePragma(data).jsx != null;

    if (isJSXFile || isJSXPragma) {
      if (!isJSXPragma) {
        data = '/** @jsx React.DOM */' + data;
      }
      try {
        var transformed = transform(data);
        this.queue(transformed);
      } catch (error) {
        this.emit('error', 'Error reactifying ' + file + ': ' + error);
      }
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
