var fs = require('fs')
var _ = require('lodash')

var englishDictionary = []
var count = 1

const DATA_DIR = './data'
//
// fs.readdir(DATA_DIR, function(err, files) {
// 	//console.log(files)
// 	files.map(function(file){
// 		var wordObject = fs.readFileSync(DATA_DIR + '/'+ file, 'utf8')
// 		var wordList = JSON.parse(wordObject)
// 		wordList.map(function(wordObject){
// 			newAddWordToDictionary(wordObject)
// 		})
// 		console.log(englishDictionary.length)
// 	})
// 	console.log('completed', englishDictionary.length)
// 	var result = _.filter(englishDictionary, function(term) {
// 		return term.english_search.indexOf("hello") > -1
// 	})
// 	fs.writeFileSync('./english.json', JSON.stringify(englishDictionary))
// 	console.log('done')
// })

var allWords = fs.readFileSync(DATA_DIR + '/' + 'english.json', 'utf8')
englishDictionary = JSON.parse(allWords)


function getWord(searchTerm){
	var re = RegExp(searchTerm)
	var result = _.filter(englishDictionary, function(term) {
		return term.english_search === searchTerm
	})
	return result
}

function addWordToDictionary(wordObject){
	if(englishDictionary.indexOf(wordObject) === -1){
			englishDictionary.push(wordObject)
	}
}

function newAddWordToDictionary(wordObject){
	var arrayResult = englishDictionary.filter(function(word){
		return word.maori_search === wordObject.maori_search && word.english_search === wordObject.english_search
	})
	if (arrayResult.length === 0){
		englishDictionary.push(wordObject)
	}
}

module.exports = {
	getWord: getWord
}
