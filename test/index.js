var assert = require('assert')

var Parser = require('../')

describe('types', function () {
  it('parses single atom', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1'])
      done()
    })
    lp.end('TAG1\r\n')
  })
  it('parses multiple atoms', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1', 'UID', 'FETCH'])
      done()
    })
    lp.end('TAG1 UID FETCH\r\n')
  })
  it('parses single quoted', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1'])
      done()
    })
    lp.end('"TAG1"\r\n')
  })
  it('parses multiword quoted', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1 UID FETCH'])
      done()
    })
    lp.end('"TAG1 UID FETCH"\r\n')
  })
  it('parses atom + quoted', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1', 'UID FETCH'])
      done()
    })
    lp.end('TAG1 "UID FETCH"\r\n')
  })
  it('parses synchronizing string literal', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1', 'ABC DEF\r\nGHI JKL', 'TAG2'])
      done()
    })
    lp.write('TAG1 {16}\r\n')
    lp.write('ABC DEF\r\nGHI JKL')
    lp.end('"TAG2"\r\n')
  })
  it('parses non-synchronizing string literal', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1', 'ABC DEF\r\nGHI JKL', 'TAG2'])
      done()
    })
    lp.write('TAG1 {16+}\r\n')
    lp.write('ABC DEF\r\nGHI JKL')
    lp.end('"TAG2"\r\n')
  })
  it('parses NIL value', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1', null])
      done()
    })
    lp.end('TAG1 NIL\r\n')
  })
  it('parses NIL string', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1', 'NIL'])
      done()
    })
    lp.end('TAG1 "NIL"\r\n')
  })
})

describe('structure', function () {
  it('parses a single group', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1', 'FETCH', ['NAME', 'HEADER', 'BODY']])
      done()
    })
    lp.end('TAG1 FETCH (NAME HEADER BODY)\r\n')
  })
  it('parses a nested group', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1', 'FETCH', ['NAME', 'HEADER', 'BODY', ['CHARSET', 'UTF-8']]])
      done()
    })
    lp.end('TAG1 FETCH (NAME HEADER BODY (CHARSET "UTF-8"))\r\n')
  })
  it('parses single params', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1', {value:'BODY', params: ['DATE', 'TEXT']}])
      done()
    })
    lp.end('TAG1 BODY[DATE TEXT]\r\n')
  })
  it('parses partial data', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1', {value:'BODY', partial: [122, 456]}])
      done()
    })
    lp.end('TAG1 BODY[]<122.456>\r\n')
  })
  it('parses mixed params and partial', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1', {value:'BODY', params: ['HEADER', 'FOOTER'], partial: [122, 456]}])
      done()
    })
    lp.end('TAG1 BODY[HEADER FOOTER]<122.456>\r\n')
  })
  it('parses nested params and groups', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1', {value:'BODY', params: ['DATE', 'FLAGS', ['\\Seen', '\\Deleted']]}])
      done()
    })
    lp.end('TAG1 BODY[DATE FLAGS (\\Seen \\Deleted)]\r\n')
  })
  it('parses bound and unbound params', function (done) {
    var lp = new Parser()
    lp.on('data', function (data) {
      assert.deepEqual(data, ['TAG1', {params: ['ALERT']}, {value:'BODY', params: ['TEXT', 'HEADER']}])
      done()
    })
    lp.end('TAG1 [ALERT] BODY[TEXT HEADER]\r\n')
  })
})

describe('events', function () {
  it('emits a log event for each line', function (done) {
    var lp = new Parser()
    lp.on('log', function (data) {
      assert.equal(data, 'TAG1 FETCH (NAME HEADER BODY)')
      done()
    })
    lp.write('TAG1 ')
    lp.end('FETCH (NAME HEADER BODY)\r\n')
  })
  it('emits a literal event after a synchronizing literal is received', function (done) {
    var lp = new Parser()
    lp.on('literal', function () {
      done()
    })
    lp.end('TAG1 {16}\r\n')
  })
})