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
        singleDef.title = $(this).find('.title').text().trim()
        var details = $(this).find('.detail')
        //console.log('word', singleDef.title)
        details.each(function(j, elem1){
          detail.push($(elem1).html())
        })
        singleDef.details = detail
        // console.log($(details).text())
        //console.log(singleDef.title.trim().split(" "))
        if (singleDef.title !== '')
          arrayDef.push(singleDef)
      })
      //
      // for (var i = 0; i < arrayDef.length; i++){
      //   if (arrayDef[i].title.html() === null){
      //     break;
      //   }
      //   console.log('WORD:',arrayDef[i].title.text())
      //   arrayDef[i].detail.each(function(i,elem){
      //     console.log('definition ', i+1, ' ', $(this).text())
      //   })
      // }

      //console.log(arrayDef)
      // arrayDef.pop()
      // arrayDef.pop()
      // arrayDef.pop()
      //

      callback(null, arrayDef)
    })
}

module.exports = {
  getDefinition: getDefinition
}
