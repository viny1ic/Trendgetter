var sqlite3 = require('sqlite3').verbose()
var express = require('express')
var http = require('http')
var path = require('path')
var bodyParser = require('body-parser')

var app = express()
var server = http.createServer(app)

var db = new sqlite3.Database('users.db')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,'../')))

db.run('CREATE TABLE IF NOT EXISTS user(name TEXT, email TEXT, password TEXT)')

app.get('/', function(req,res){
    console.log('kul ')
    res.sendFile(path.join(__dirname, '../signup.html'));
    
  })


app.post("/signup", function(req, res){
  console.log("helo", req.body)
  if(req.body.password != req.body.cpassword){
    res.send("password and confirm password do not match")
    // res.sendFile(path.join(__dirname,'../signup.html'))
  }
  else{
    // res.sendFile(path.join(__dirname,'../signin.html'))
    db.run('INSERT INTO user(name, email, password) VALUES(?,?,?)', [req.body.name, req.body.email, req.body.password], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New user has been added");
      res.send("new user created with name: "+req.body.name);
    });
  }
})



app.listen(3000)