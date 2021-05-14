var firebase = require('firebase');
var request = require('request')
var dotenv = require('dotenv').config()

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

var to_set = {
    watches: null,
    jewelry: null
}

setData('https://www.reddit.com/r/Watches.json')
setData('https://www.reddit.com/r/jewelry.json')
setData('https://www.reddit.com/r/mensfashion.json')
setData('https://www.reddit.com/r/femalefashion.json')
setData('https://www.reddit.com/r/Sneakers.json')

function setData(url){
  request(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    var data = body.data.children
    to_set[data[0].data.subreddit] = getData(data)
    firebase.database().ref('reddit/').set(to_set);
    });
}


function getData(data){
    var ans = {}
    for(x in data){
        if(data[x].data.is_video ==false && data[x].data.thumbnail!='self'){
          var img = data[x].data.url_overridden_by_dest
          try{
              if(img.slice(img.length - 4)==".jpg" || img.slice(img.length - 4)==".png" || data[x].data.title != undefined)
                var title = data[x].data.title
                ans[data[x].data.name] = {
                    img, title
                }
              }
          finally{continue}
          }
        }
        return ans
    }