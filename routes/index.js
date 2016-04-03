var express = require('express');
var router = express.Router();


/* GET home page. */




// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });


module.exports = function(io) {
  var app = require('express')
  var router = app.Router()

  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Ki Mai' });
  });

  io.on('connection', function(socket) {
    socket.on('message', function(message){
      console.log('the message is ', message)
      io.emit('message', message)
    })

  })

  return router;
}
