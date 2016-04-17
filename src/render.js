function createWord(wordsObject, theWord){
  var wordDiv = document.createElement('button')
  wordDiv.className = 'word btn btn-default'
  var word = document.createElement('p')
  if (wordsObject)
    var theWord = wordsObject[0].english_search
  word.innerHTML = theWord
  wordDiv.appendChild(word)
  return wordDiv
}

module.exports = {
  createWord: createWord

}
