var express = require('express');
var router = express.Router();
var path = require('path')
var db = require(path.join(__dirname, '../db/db'));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users')
});

router.get('/all', function(req, res, next){
  db.getUsers().then(function(result){
    console.log('users', result)
    res.send(result)
  })
})

module.exports = router;
