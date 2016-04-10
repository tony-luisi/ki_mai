var request = require('superagent')
var cheerio = require('cheerio')
var word = 'maro'


request.get('http://maoridictionary.co.nz/search?idiom=&phrase=&proverb=&loan=&histLoanWords=&keywords=' + word)
  .end(function(err, res){
    $ = cheerio.load(res.text)
    $('h2').each(function(i, elem){
      var line = $(this).text().split(' ').join(' ').trim()
      var lineWithoutNewLine = line.split('\n')
      var finalWord = lineWithoutNewLine[0].trim()
      console.log(finalWord)
    })

    console.log($('.content').find('div').text())



  })
