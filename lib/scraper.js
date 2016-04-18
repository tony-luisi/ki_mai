var request = require('superagent')
var cheerio = require('cheerio')
var word = 'potae'

// getDefinition("pehea", function(err, res){
//
// })

function getDefinition(word, callback){
  request.get('http://maoridictionary.co.nz/search?idiom=&phrase=&proverb=0&loan=&histLoanWords=&keywords=' + word)
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
        var detail = []
        singleDef.from = word
        singleDef.title = $(this).find('.title').text().trim()
        var details = $(this).find('.detail')
        singleDef.to = singleDef.title
        //console.log('word', singleDef.title)
        details.each(function(j, elem1){
          detail.push($(elem1).html())
        })
        singleDef.details = detail
        singleDef.definition = detail
        // console.log($(details).text())
        //console.log(singleDef.title.trim().split(" "))
        if (singleDef.title !== '')
          arrayDef.push(singleDef)
      })


      callback(null, arrayDef)
    })
}

module.exports = {
  getDefinition: getDefinition
}
