var express = require('express');
var router = express.Router();
var path = require('path')
var db = require(path.join(__dirname, '../db/db'));

/* GET users listing. */
router.get('/', function(req, res){
  res.send('word')
});

router.post('/lookup', function(req, res){
  db.addLookupWord({ userid: req.session.userId, word: req.body.word })
})

router.post('/replace', function(req, res){

})


module.exports = router;
