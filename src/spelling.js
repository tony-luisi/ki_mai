var request = require('superagent')


function getSpelling(callback){
  console.log('making request')
  request.get('/spelling/mi_NZ.dic').end(function(err, res){
    if (err){
      callback(err)
      return
    }
    callback(null, res)
  })
}

module.exports = {
  getSpelling: getSpelling
}
