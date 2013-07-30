react = require 'react-tools'
docblock = require 'react-tools/vendor/fbtransform/lib/docblock'
through = require 'through'

isJSXExtensionRe = /^.+\.jsx$/
parsePragma = (data) ->
  docblock.parseAsObject(docblock.extract(data))

module.exports = (file) ->
  # check file extension or /** @jsx React.DOM */ pragma

  data = ''
  write = (chunk) ->
    data += chunk

  compile = ->
    isJSXExtension = isJSXExtensionRe.exec(file)
    isJSXPragma = parsePragma(data).jsx?

    if isJSXExtension or isJSXPragma
      if isJSXExtension and not isJSXPragma
        data = '/** @jsx React.DOM */' + data
      try
        transformed = react.transform(data)
      catch e
        this.emit 'error', e
      this.queue(transformed)
    else
      this.queue(data)
    this.queue(null)

  through(write, compile)
