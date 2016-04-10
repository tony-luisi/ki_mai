var request = require('superagent')
var cheerio = require('cheerio')
var word = 'dinner'


request.get('http://maoridictionary.co.nz/search?idiom=&phrase=&proverb=&loan=&histLoanWords=&keywords=' + word)
  .end(function(err, res){
    $ = cheerio.load(res.text, {
      ignoreWhitespace: true
    })
    $('a').remove()
    $('audio').remove()
    $('.example').remove()
    $('.more').remove()
    // $('h2').each(function(i, elem){
    //   var line = $(this).text().split(' ').join(' ').trim()
    //   var lineWithoutNewLine = line.split('\n')
    //   var finalWord = lineWithoutNewLine[0].trim()
    //   console.log(finalWord)
    // })
    var arrayDef = []
    // console.log(Object.keys($('.content')[0].name))
    $('section').each(function(i,elem){
      var singleDef = {}
      singleDef.title = $(this).find('.title')
      singleDef.detail = $(this).find('.detail')
      arrayDef.push(singleDef)
      //console.log('length',$(this).find('.detail').length)
      //console.log("Title: ", $(this).find('.title').text())
      //console.log("detail: ", $(this).find('.detail').text())
    })
    // console.log("SECTION: ", $('section').text())
    for (var i = 0; i < arrayDef.length; i++){
      if (arrayDef[i].title.html() === null){
        break;
      }
      console.log('WORD:',arrayDef[i].title.text())
      arrayDef[i].detail.each(function(i,elem){
        console.log('definition ', i+1, ' ', $(this).text())
      })
    }

    //console.log(arrayDef[0].detail.find('p').html())

  })
