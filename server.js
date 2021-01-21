// server.js
// where your node app starts

// load environment variables :
require('dotenv').config();

// init project :
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// get method :
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/timestamp/:d", function (req, res) {
  res.json(parseDate(req.params.d));
});


// listen for requests :
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// api functions :
function parseDate(date){
  if(/^\d*$|^-\d*$/.test(date)){
    let d = new Date();
    d.setTime(date);
    return {unix: Number.parseInt(date), utc: formatDate(d)};
  }
  else if(/^\d{1,2}}-\d{1,2}}-\d{1,2}}:\d{1,2}}:\d{1,2}}$/.test(date)){
    //TODO
  }
  else if(/^\d{1,2}}-\d{1,2}}-\d{1,2}}:\d{1,2}}$/.test(date)){
    //TODO
  }
  else if(/^\d{1,2}}-\d{1,2}}$/.test(date)){
    //TODO
  }
  else if(/^\d{1,2}}-\d{1,2}}-\d{1,2}}$/.test(date)){
    //TODO
  }
  else if(/^\d{1,2}}-\d{1,2}}-\d{1,2}}-\d{1,2}}:\d{1,2}}/.test(date)){
      //TODO
  }
  else if(/^\d{1,2}}-\d{1,2}}-\d{1,2}}-\d{1,2}}:\d{1,2}}:\d{1,2}}/.test(date)){
      //TODO
  }
  else return {error: 'Invalid Date!'};
}

function formatDate(date){
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mer','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let day = date.getUTCDate() > 9 ? date.getUTCDate() : '0' + date.getUTCDate();
  let hour = date.getUTCHours() > 9 ? date.getUTCHours() : '0' + date.getUTCHours();
  let minute = date.getUTCMinutes() > 9 ? date.getUTCMinutes() : '0' + date.getUTCMinutes();
  let second = date.getUTCSeconds() > 9 ? date.getUTCSeconds() : '0' + date.getUTCSeconds();
  return `${days[date.getUTCDay()]}, ${day} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()} ${hour}:${minute}:${second} GMT`
}