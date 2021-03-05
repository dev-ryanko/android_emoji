const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const { EventEmitter } = require('events');
// const eventEmitter = new events.EventEmitter();
const moment = require('moment')
require('console-stamp')(console, { pattern: 'yyyy-mm-dd HH:MM:ss.l' });

const app = express();
const port = 8080
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//init amqp
var amqp = require('amqplib/callback_api');


/*
emoticon = {
  name:'panda_face',
}
*/

//현재시간
let created_date = moment().format('YYYY-MM-DD HH:mm:ss')

app.get('/handlecheck', function (req, res)  {
  res.send('hello check')
  console.log('handle check ok')
})


app.post('/rest/racetrack/emotion', (req,res) => {
  var url = 'amqp://racetrack:racetrack@18.162.209.111:5672'
  amqp.connect(url+'/racetrack', (connectionError, connection) => {
    if(connectionError) {
      throw connectionError
    }
  connection.createChannel(function(channelError, channel) {
    if(channelError) {
      throw channelError
    }
    const exchange = 'direct_logs'
    var msg = req.body.name
    var serverity = 'racetrack'
    channel.assertExchange(exchange, 'direct', {
      durable: false
    });
    channel.publish(exchange, serverity, Buffer.from(msg));
    console.log("[x] Send %s: '%s'", serverity, msg)
  });
  res.send('ok')
})
})

app.listen(port, function () {
  console.log(`android-chating-emoji is listening on port ${port}...`)
})