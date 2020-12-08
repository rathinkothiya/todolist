//jshint esversion:6
exports.getDate = function(){
  const date = new Date();
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
return date.toLocaleDateString("en-US", options);

}

module.exports.getDay = getDay;

function getDay(){
  var date = new Date();
  //res.sendFile(__dirname + '/index.html');
  var options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  return date.toLocaleDateString("en-US", options);

}
