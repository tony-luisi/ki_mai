var input = require('./input')
var phrase = require('./phrase')
var translate = require('./translate')
var spelling = require('./spelling')


$('form').submit(function(){
  var auth2 = gapi.auth2.getAuthInstance()
  var user = auth2.currentUser.get()
  input.submitChatMessage(user)
  phrase.clear()
  return false
})

//when a user types a key in the chat - and wants a word to be translated
$('#m').on('keyup', function() {
  var message = input.getChatMessage()
  phrase.update(message)
  translate.update(message)
})


$('#sendbutton').click(function(){
  var auth2 = gapi.auth2.getAuthInstance()
  var user = auth2.currentUser.get()
  input.submitChatMessage(user)
  phrase.clear()
  return false
})

$('#search-pane').click(function(){
  var message = input.getChatMessage()
  phrase.update(message)
})

function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {
  console.log('success')

  navigator.getUserMedia  = navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia;

  window.AudioContext = window.AudioContext ||
                      window.webkitAudioContext;

  var context = new AudioContext();

  var audio = document.querySelector('audio');

  if (navigator.getUserMedia) {


    navigator.getUserMedia({audio: true}, function(stream) {
      var microphone = context.createMediaStreamSource(stream);
      var filter = context.createBiquadFilter();

      // microphone -> filter -> destination.
      microphone.connect(filter);
      filter.connect(context.destination);
    }, function (error) {
      console.log(error)
    });
  }

} else {
  alert('getUserMedia() is not supported in your browser');
}

// navigator.mediaDevices.getUserMedia({ audio: true, video: false })
//   .then(function(mediaStream){
//     //var audio = document.querySelector('#audio');
//     // video.src = window.URL.createObjectURL(mediaStream);
//     // video.onloadedmetadata = function(e) {
//     //
//     // }
//     // Do something with the video here.
//     console.log(mediaStream)
//   })
//   .catch(function(error) {
//     console.log(error)
//   })
