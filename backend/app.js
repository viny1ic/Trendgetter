var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var firebase = require('firebase');
var dotenv = require('dotenv').config()

var app = express()

var firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.measurementId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};
firebase.initializeApp(firebaseConfig);


app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,'../')))

app.get('/', function(req,res){
    console.log('kul ')
    res.sendFile(path.join(__dirname, '../signup.html'));
    
  })

app.get("/signin", function(req,res){
  res.sendFile(path.join(__dirname,'../signin.html'))
})

app.get("/signup", function(req,res){
  res.sendFile(path.join(__dirname,'../signup.html'))
})
app.post("/signup", function(req, res){
  console.log("helo")
  if(req.body.password != req.body.cpassword){
    res.send("password and confirm password do not match")
    // res.sendFile(path.join(__dirname,'../signup.html'))
  }
  else{
    firebase.database().ref(req.body.username).once('value')
      .then(function(snapshot) {
        console.log(snapshot.val())
        if(snapshot.val() == null){
          var data = {name, username, email, password, cpassword} = req.body
          firebase.database().ref(req.body.username).set({name, username, email, password, cpassword})
          res.sendFile(path.join(__dirname,'../signin.html'))}

      
      if(snapshot.val() != null){
        res.send("Username unavailable")
      }
    })
  }
})



app.post("/signin", function(req,res){
  firebase.database().ref(req.body.username).once('value')
  .then(function(snapshot){
    console.log(snapshot.val())
    if(snapshot.val()==null){
      res.send("check username/password")
    }
    else if(snapshot.val().password != req.body.password){
      res.send("check username/password")
    }
    else if((snapshot.val().password == req.body.password) && (snapshot.val().username == req.body.username)){
      res.sendFile((path.join(__dirname,'../home.html')))
    }
  })
})
app.listen(80,()=>{
    console.log('server at http://localhost');
});
