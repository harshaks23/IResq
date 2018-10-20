var express = require('express')
var path = require('path');
var app = express()
 
app.use(express.static('dist'))
// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname + '/dist/index.html'));
// });

app.get('/test', function (req, res) {
  res.send('Hello World')
})
 
app.listen(3000)

var app = express();

