var scraper = require('./scraper')

// var word = english.getWord("name")
//
// console.log(word)
scraper.getDefinition("hello", function(err, res){
  console.log(res)
})
