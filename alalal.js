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

// init mysql
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'cggames-emoji.ctgaq8dwv5qw.ap-east-1.rds.amazonaws.com',
  user: 'thunder',
  password:'Tjsej!0716',
  database:'thunder-emoji',
  multipleStatements:'true'
})

// connect to DB Server
connection.connect(function(err) {
  if (err) {
    console.error('error connecting to DB Server: ' + err.stack);
    exit;
  }

  console.log('connected as id ' + connection.threadId);
});


/*
emoticon = {
  id: '0',
  name:'panda_face',
  unicod: 'U+1F43C'
}
*/

//현재시간
let created_date = moment().format('YYYY-MM-DD HH:mm:ss')

app.get('/handlecheck', function (req, res)  {
  res.send('hello check')
})


app.post('/rest/chat/input/emoji', (req,res) => {
  console.log(req.body)
  let sql = "INSERT INTO android_chat (name, unicode, createTime)";
  sql += `VALUES ("${req.body.name}", "${req.body.unicode}", "${created_date}")`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err)
      throw err;
    } else { 
      console.log(moment().format('YYYY-MM-DD HH:mm:ss'), "INSERT EVENT: OK");
      return res.status(201).send({error:false, data: result, message:'complete'})
    }
  })
})

app.get('/rest/chat/output/emoji', (req, res) => {
  const sql  = `SELECT * FROM android_chat ORDER BY createTime  desc LIMIT 1;`
  connection.query(sql, (error, results) => {
    if (error) {
      res.send({ error: true, message: error });
    }

    console.log(results);
    return res.send(results);
  })
})

app.listen(port, function () {
  console.log(`android-chating-emoji is listening on port ${port}...`)
})
