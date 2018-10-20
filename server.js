var express = require('express')
var path = require('path');
var app = express()

app.use(express.static('dist'))

app.get('/getKey', function (req, res) {
  res.send({ niceText : process.env.APPKEY});
})
 
var server = app.listen(process.env.PORT || 3000)
var io = require('socket.io').listen(server);

io.on('connection', function(socket){
  console.log('user is connected');
  socket.on('onImageDetect', function(data){
    io.emit('onMapUpdate', data);
    console.log('message: ' + data.message);
  });
});
