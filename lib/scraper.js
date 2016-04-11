var request = require('superagent')
var cheerio = require('cheerio')
var word = 'potae'

function getDefinition(word, callback){
  request.get('http://maoridictionary.co.nz/search?idiom=&phrase=&proverb=&loan=&histLoanWords=&keywords=' + word)
    .end(function(err, res){
      if (err){
        callback(err)
        return
      }

      $ = cheerio.load(res.text, {
        ignoreWhitespace: true
      })
      $('a').remove()
      $('audio').remove()
      $('.example').remove()
      $('.more').remove()

      var arrayDef = []

      $('section').each(function(i,elem){
        var singleDef = {}
        singleDef.title = $(this).find('.title')
        singleDef.detail = $(this).find('.detail')
        arrayDef.push(singleDef)
      })

      for (var i = 0; i < arrayDef.length; i++){
        if (arrayDef[i].title.html() === null){
          break;
        }
        console.log('WORD:',arrayDef[i].title.text())
        arrayDef[i].detail.each(function(i,elem){
          console.log('definition ', i+1, ' ', $(this).text())
        })
      }
      callback(null, arrayDef)
    })
}

module.exports = getDefinition
