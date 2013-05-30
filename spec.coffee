{ok} = require 'assert'
browserify = require 'browserify'
reactify = require './src/index'

describe 'reactify', ->

  bundle = (entry, cb) ->
    b = browserify(entry)
      .transform(reactify)
      .bundle(cb)

  it 'works for js with pragma', (done) ->
    bundle './fixtures/main.js', (err, result) ->
      ok not err
      ok result
      done()

  it 'works for js with pragma', (done) ->
    bundle './fixtures/main.jsx', (err, result) ->
      ok not err
      ok result
      done()
