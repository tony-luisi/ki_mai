var express = require('express');
var router = express.Router();
var path = require('path')
var db = require(path.join(__dirname, '../db/db'));
var passwordHash = require('password-hash')
var bcrypt = require('bcrypt')
const saltRounds = 10

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('here')
  res.render('users')
});

router.post('/login', function(req, res, next){
  db.getUser({ email: req.body.email })
    .then(function(result){
      if (result.length == 0){
        res.redirect('/')
      } else {
        //need to check if facebook user
        var user = result[0]
        if (user.facebookid) {
          res.redirect('/auth/facebook')
        } else{
          var authenticatedUser = bcrypt.compareSync(req.body.password, user.password)
          if (authenticatedUser){
            req.session.userId = user.id
            res.redirect('/chat')
          } else {
            res.redirect('/')
          }
        }
      }
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
      res.redirect('/')
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
