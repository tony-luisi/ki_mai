
function startApp(){
  console.log('loaded')
  var auth2 = gapi.auth2.getAuthInstance()
  console.log('singed in', auth2.isSignedIn.get())
  auth2.then(loaded, failure)
}

function loaded(){
  console.log('logged in')
  var auth2 = gapi.auth2.getAuthInstance()
  console.log('singed in', auth2.isSignedIn.get())
  var user = auth2.currentUser.get()
  var basicProfile = user.getBasicProfile()
  $('#username').text(basicProfile.getName())

  // var xhr = new XMLHttpRequest();
  // xhr.open('POST', '/');
  // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // xhr.onload = function() {
  //   console.log('Signed in as: ' + xhr.responseText);
  // };
  // xhr.send('idtoken=' + id_token);
}

function failure(){
  console.log('failed')

}
