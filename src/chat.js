function addMessage(messageObject){
  $('#messages').append($('<li class="animated fadeInUp">').text(messageObject.from + ": " + messageObject.message))
  $('#message-pane').scrollTop($('#message-pane').scrollTop() + 100)
}


module.exports = {
  addMessage: addMessage
}
