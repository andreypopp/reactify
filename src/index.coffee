react = require 'react-tools'
through = require 'through'

isJSXExtensionRe = /^.+\.jsx$/
isJSExtensionRe = /^.+\.js$/
isJSXPragmaRe = /\/\*\* +@jsx +React.DOM +\*\//

module.exports = (file) ->
  # check file extension or /** @jsx React.DOM */ pragma
  isJSXExtension = isJSXExtensionRe.exec(file)
  isJSXPragma = undefined

  data = ''
  write = (chunk) ->
    data += chunk
    if isJSXPragma is undefined
      newLineIdx = data.indexOf('\n')
      if newLineIdx > -1
        firstLine = data.substr(0, newLineIdx).trim()
        isJSXPragma = isJSXPragmaRe.exec(firstLine)

  compile = ->
    if isJSXExtension or isJSXPragma and isJSExtensionRe.exec file
      if isJSXExtension and not isJSXPragma
        data = '/** @jsx React.DOM */\n' + data
      try
        transformed = react.transform(data)
      catch e
        this.emit 'error', e
      this.queue(transformed)
    else
      this.queue(data)
    this.queue(null)

  through(write, compile)
