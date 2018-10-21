var express = require('express')
var path = require('path');
var app = express()
const bodyParser = require('body-parser');

app.use(express.static('dist'))

const accountSid = 'AC12446ff63d16f5749cf9d3d59c0465dc';
const authToken = '77672a18715f646025afea018ef1094d';
const client = require('twilio')(accountSid, authToken);

// app.get('/getKey', function (req, res) {
//   res.send({ niceText : process.env.APPKEY});
// })

app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'})); 

app.get('/getKey', function (req, res) {
  res.send({ niceText : 'AIzaSyB89RJomI4mGS6z2C7aRINATrCZQn7Sq68'});
})

app.post('/text', async(req, res) => {
  console.log(req.body.text);
  const {image, number, text} = req.body;
  if (image) {
  const hashedName = 'incident';
  const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");

  const filePath = `./dist/images/${hashedName}.jpeg`;
  console.log(__dirname);
  await require("fs").writeFile(filePath, base64Data, 'base64', function (err) {
    console.log(err);
  });
  console.log(req.headers.host + `c/images/${hashedName}.jpeg`);

  client
    .messages
    .create({
      to: `+1${number}`,
      from: '+13124710558',
      body: 'There is an intruder',
      mediaUrl: 'https://' + req.headers.host + `/images/${hashedName}.jpeg`
    })
    .then((message) => console.log('image message succesfully sent!'))
    .catch((e) => console.log('error ', e));

  res.end('cool!');
  } else {
    client
    .messages
    .create({
      to: `+1${number}`,
      from: '+13124710558',
      body: text,
    })
    .then((message) => console.log('message succesfully sent!'))
    .catch((e) => console.log('error ', e));

  }
});


 
var server = app.listen(process.env.PORT || 3000)
var io = require('socket.io').listen(server);

io.on('connection', function(socket){
  console.log('user is connected');
  socket.on('onImageDetect', function(data){
    io.emit('onMapUpdate', data);
    console.log('message: ' + data.message);
  });
});
