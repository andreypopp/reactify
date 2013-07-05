{ok} = require 'assert'
browserify = require 'browserify'
reactify = require './src/index'
coffeeify = require 'coffeeify'

describe 'reactify', ->

  bundle = (entry, cb) ->
    b = browserify(entry)
      .transform(coffeeify)
      .transform(reactify)
      .bundle(cb)

  it 'works for *.js with pragma', (done) ->
    bundle './fixtures/main.js', (err, result) ->
      ok not err
      ok result
      done()

  it 'works for *.jsx', (done) ->
    bundle './fixtures/main.jsx', (err, result) ->
      ok not err
      ok result
      done()

  it 'works for plain *.js', (done) ->
    bundle './fixtures/simple.js', (err, result) ->
      ok not err
      ok result
      done()

  it 'works for *.coffee', (done) ->
    bundle './fixtures/coffee.coffee', (err, result) ->
      ok not err
      ok result
      done()

  it 'returns error on invalid JSX', (done) ->
    bundle './fixtures/invalid.js', (err, result) ->
      ok err
      ok not result
      done()
