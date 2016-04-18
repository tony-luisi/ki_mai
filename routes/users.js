var express = require('express');
var router = express.Router();
var path = require('path')
var db = require(path.join(__dirname, '../db/db'));
var passwordHash = require('password-hash')
var bcrypt = require('bcrypt')
const saltRounds = 10

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users')
});

router.post('/login', function(req, res, next){
  db.getUser({ username: req.body.username })
    .then(function(result){
      if (result.length == 0){
        res.redirect('/')
      } else {
        var user = result[0]
        req.session.userId = user.id
        res.redirect('/chat')
      }
    })
})

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

router.get('/new', function(req,res,next){
  res.render('usersNew')
})

router.post('/', function(req, res, next){
  var user = req.body
  bcrypt.hash(user.password, saltRounds, function(err, hash){
    user.password = hash
    db.addUser(user).then(function(result){
      console.log('row affected', result)
      res.send(req.body)
    })
  })

})


router.get('/session', function(req, res, next){
  var sess = req.session
  if (sess.views) {
    sess.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + sess.views + '</p>')
    res.write('<p>expires in: ' + sess.cookie.maxAge + 's</p>')
    res.end()
  } else {
    sess.views = 1
    res.end('welcome to the session demo. refresh!')
  }
})

module.exports = router;
