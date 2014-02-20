var docblock  = require('jstransform/src/docblock');
var transform = require('react-tools').transform;
var through   = require('through');

var isJSXExtensionRe = /^.+\.jsx$/;

function parsePragma(data) {
  return docblock.parseAsObject(docblock.extract(data));
}

function process(file, isJSXFile, transformer) {
  transformer = transformer || transform;

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
        var transformed = transformer(data);
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

function getExtensionsMatcher(extensions) {
  return new RegExp('\.(' + extensions.join('|') + ')$');
}

module.exports = function(file, options) {
  var extensions = ['jsx']
    .concat(options.extension)
    .concat(options.x)
    .filter(Boolean)
    .map(function(ext) { return ext[0] === '.' ? ext.slice(1) : ext });
  var isJSXFile = getExtensionsMatcher(extensions);
  return process(file, isJSXFile.exec(file));
};
module.exports.process = process;
module.exports.isJSXExtensionRe = isJSXExtensionRe;
