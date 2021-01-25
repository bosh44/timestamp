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
app.get("/api/timestamp/:d", function (req, res) {
  res.json(parseDate(req.params.d));
});

app.get("/api/timestamp", function (req, res){
  let d = new Date();
  res.json({unix: d.getTime(), utc: formatDate(d)});
});

// listen for requests :
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// api functions :
// parseDate: the main function used to parse and validate the date.
// in: date String (exp: '2015-12-25-14:30:15')
// out: Obj {unix: Number, utc: String} (exp: {unix: 1451053815000, utc: "Fri, 25 Dec 2015 14:30:15 GMT"})
function parseDate(date){
  const err = {error: 'Invalid Date!'};
  let d = new Date();
  d.setUTCHours(0,0,0,0);
  if(/^\d*$|^-\d*$/.test(date)){
    d.setTime(date);
    return {unix: Number.parseInt(date), utc: formatDate(d)};
  }
  else if(/^\d{1,4}-\d{1,4}-\d{1,4}$/.test(date)){
    let yearMonthDay = getYearMonthDay(date);
    if(yearMonthDay==='error') return err;
    d.setUTCMonth(yearMonthDay[1]-1);
    d.setUTCDate(yearMonthDay[2]);
    d.setUTCFullYear(yearMonthDay[0]);
    return {unix: d.getTime(), utc: formatDate(d)};
  }
  else if(/^\d{1,4}-\d{1,2}-\d{1,4}-\d{1,2}:\d{1,2}$|^\d{1,4}-\d{1,2}-\d{1,4}-\d{1,2}:\d{1,2}:\d{1,2}$/.test(date)){
    let yearMonthDay = getYearMonthDay(date);
    let time = getHours(date);
    if(yearMonthDay==='error'||time==='error') return err;
    d.setUTCHours(time.hour,time.minute,time.second);
    d.setUTCMonth(yearMonthDay[1]-1);
    d.setUTCDate(yearMonthDay[2]);
    d.setUTCFullYear(yearMonthDay[0]);
    return {unix: d.getTime(), utc: formatDate(d)};
  }
  else return err;
}

// formmtDate: used to create a string out of a 'Date' object.
// in: date Date
// out: String (exp: "Fri, 25 Dec 2015 12:30:02 GMT")
function formatDate(date){
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mer','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let day = date.getUTCDate() > 9 ? date.getUTCDate() : '0' + date.getUTCDate();
  let hour = date.getUTCHours() > 9 ? date.getUTCHours() : '0' + date.getUTCHours();
  let minute = date.getUTCMinutes() > 9 ? date.getUTCMinutes() : '0' + date.getUTCMinutes();
  let second = date.getUTCSeconds() > 9 ? date.getUTCSeconds() : '0' + date.getUTCSeconds();
  return `${days[date.getUTCDay()]}, ${day} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()} ${hour}:${minute}:${second} GMT`
}

// getYearMonthDay: helps to parse the date string given to the api.
// in: date String (exp: '2014-12-31-12:30:15')
// out: Array [YEAR,MONTH,DAY] (exp: [2014,12,31])
function getYearMonthDay(date){
  let arr = date.match(/\d+/g).map(e=>Number.parseInt(e));
  let [month, year, day] = arr[0]>arr[2] ? [arr[1], arr[0], arr[2]] : [arr[0], arr[2], arr[1]];
  if(isValidMonth(month)&&isValidDate(day)) return [year, month, day];
  return 'error';
}

/// getHours: helps to parse the hour string given to the api.
// in: date String (exp: '2014-12-31-12:30:15')
// out: Obj {hour: Number, minute: Number, second: Number} (exp: {hour:12,minute:30,second:15})
function getHours(date){
  let hours = date.match(/\d{1,2}:\d{1,2}:\d{1,2}|\d{1,2}:\d{1,2}/)[0].split(':').map(e=>Number.parseInt(e));
  if(hours.length===3){
    if(hours[1]>59||hours[2]>59||hours[2]<0||hours[1]<0||hours[0]<0||hours[0]>23) return 'error';
    return {hour: hours[0], minute: hours[1], second: hours[2]};
  }
  return {hour: hours[0], minute: hours[1], second: 0};
}

// isValidMonth, isValidDate: Validates that the values are legal.
// in: m Number / d Number (exp: isValidMonth(5) / isValidDay(35))
// out: Boolean (exp: true / false)
function isValidMonth(m){
  if(m<13&&m>0) return true;
  return false;
}
function isValidDate(d){
  if(d<32&&d>0) return true;
  return false;
}