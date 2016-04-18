var fs = require('fs')
var _ = require('lodash')
var path = require('path')

var maoriDictionary = []
var count = 1

const DATA_DIR = path.join(__dirname, '/data_maori')


// var allWords = fs.readFileSync(path.join(DATA_DIR, 'english.json'), 'utf8')
var files = fs.readdirSync(DATA_DIR)
for (var file in files){
	var contents = fs.readFileSync(path.join(DATA_DIR, files[file]), "utf8")
	var dictionaryObject = JSON.parse(contents)
	dictionaryObject.map(function(current_word){
		var foundWords = maoriDictionary.filter(function(word){
			return word.english_search == current_word.english_search
		})
		if(foundWords.length == 0){
			maoriDictionary.push(current_word)
		} else {
			// console.log('match')
		}
	})
	console.log(maoriDictionary.length)
}
fs.writeFileSync('maori.json',JSON.stringify(maoriDictionary))
