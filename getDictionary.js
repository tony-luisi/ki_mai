var request = require('superagent')
var fs = require('fs')

var letters = 'aeiouāēīōūhkmnprtw'
var phrases = ['ng','wh']

phrases.map(function(letter) {
	console.log(letter)

	lookupWord(letter, 'maori', function(err, res){
		console.log(res)
		fs.writeFile('./datamaori/' + letter + ".json", JSON.stringify(res), function(err) {
			console.log(err)
		})

	})

})


//lookupWord('funny', 'english')



function lookupWord(word, language, callback) {
	request.get('http://www.learningmedia.co.nz/ngata?type='+language+'&s='+word+'&date='+Date.now())
		.set('Accept', 'application/json, text/javascript, */*; q=0.01')
		.set('X-Requested-With', 'XMLHttpRequest')
		.end(function (err, res){
			if (err) {
				callback(err)
				return
			}
			callback(null, res.body)
		})
}
