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

router.get('/words', function(req, res, next){
  db.allWords().then(function(result){
    res.send(result)
  })
})

router.get('/session', function(req, res, next){
  var sess = req.session
  if (sess.views) {
    sess.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + sess.views + '</p>')
    res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    sess.views = 1
    res.end('welcome to the session demo. refresh!')
  }
})

module.exports = router;
