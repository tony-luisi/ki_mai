var express = require('express');
var router = express.Router();
var path = require('path')
var db = require(path.join(__dirname, '../db/db'));

/* GET users listing. */
router.get('/', function(req, res){
  res.send('word')
});

router.post('/lookup', function(req, res){
  db.addLookupWord({ userid: req.session.userId, word: req.body.word }).then(function(result){
    console.log(result)
  }).catch(function(error){
    console.log("already added")
  })
})



router.get('/lookup', function(req, res){
  db.getLookupWords()
    .then(function(result){
      res.send(result)
    })
})

router.get('/lookup/:id', function(req, res){
  console.log("id", req.params.id)
  db.getLookupWordsByUser({ userid: req.params.id })
    .then(function(result){
      res.send(result)
    })
})

router.get('/replace', function(req,res){
  db.getReplaceWords()
    .then(function(result){
      res.send(result)
    })

})

router.get('/replace/:id', function(req,res){
  db.getReplaceWordsByUser({ userid: req.params.id })
    .then(function(result){
      res.send(result)
    })

})

router.post('/replace', function(req, res){
  console.log('req', req.body.definition, 'userid', req.session.userId)

  db.addReplaceWord({ from_word: req.body.fromWord, to_word: req.body.toWord, definition: req.body.definition, userid: req.session.userId}).then(function(result){
    console.log(result)
  }).catch(function(error){
    console.log("already added")
  })
})

router.get('/log', function(req,res){
  res.render('wordsLog')
})



module.exports = router;
