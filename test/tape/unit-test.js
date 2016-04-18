var test = require('tape')
var api1 = require(__dirname + '/../../lib/scraper')
var api2 = require(__dirname + '/../../lib/english')

test('library tests - API 1', function(t){
  api1.getDefinition("hello", function(err, result){
    t.equal(result.length, 4, 'API responded with a result')
    t.true(Object.keys(result[0]).indexOf('to') > -1, 'API has a "to" key field')
    t.true(Object.keys(result[0]).indexOf('from') > -1, 'API has a "from" key field')
    t.true(Object.keys(result[0]).indexOf('definition') > -1, 'API has a "definition" key field')
    t.end()
  })
})

test('library tests - API 2', function(t){
    var result = api2.getWord("hello")
    t.equal(result.length, 3, 'API responded with a result')
    t.true(Object.keys(result[0]).indexOf('to') > -1, 'API has a "to" key field')
    t.true(Object.keys(result[0]).indexOf('from') > -1, 'API has a "from" key field')
    t.true(Object.keys(result[0]).indexOf('definition') > -1, 'API has a "definition" key field')
    t.end()



})

test('server tests', function(t){
  t.end()
})

test('database tests', function(t){
  t.end()
})

test('client tests', function(t){
  t.end()
})
