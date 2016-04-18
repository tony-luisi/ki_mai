var fs = require('fs')
var _ = require('lodash')
var path = require('path')

var englishDictionary = []
var count = 1

const DATA_DIR = path.join(__dirname, '/data_maori')

var allWords = fs.readFileSync(path.join(DATA_DIR, 'maori.json'), 'utf8')
englishDictionary = JSON.parse(allWords)

console.log(getWord("pehea"))

function getWord(searchTerm){
	var re = RegExp(searchTerm)
	var result = _.filter(englishDictionary, function(term) {
		return term.maori_search.indexOf(searchTerm) > -1
	})
	result.map(function(word){
		word.from = word.english_search
		word.to = word.maori_search
		word.definition = []
		word.definition.push(word.english_sentence)
		word.definition.push(word.maori_sentence)
		word.maori_sentence
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
