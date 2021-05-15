var firebase = require('firebase');
var request = require('request')
var dotenv = require('dotenv').config()
var fs = require('fs')

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

// setData('https://www.reddit.com/r/Watches.json')
// setData('https://www.reddit.com/r/jewelry.json')
// setData('https://www.reddit.com/r/mensfashion.json')
// setData('https://www.reddit.com/r/femalefashion.json')
// setData('https://www.reddit.com/r/Sneakers.json')
// setData('https://www.reddit.com/r/ItalianFood.json')
// setData('https://www.reddit.com/r/chinesefood.json')
// setData('https://www.reddit.com/r/mexicanfood.json')
// setData('https://www.reddit.com/r/JapaneseFood.json')
// setData('https://www.reddit.com/r/frenchfood.json')
setData('https://www.reddit.com/r/movies.json')
function setData(url){
  request(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    var data = body.data.children
    to_set[data[0].data.subreddit] = getData(data)
    firebase.database().ref('reddit/').set(to_set);
    });
}

var name = 0
function getData(data){
    var ans = {}
    for(x in data){
        if(data[x].data.is_video ==false && data[x].data.thumbnail!='self'){
          var img = data[x].data.url_overridden_by_dest
          try{
              if(img.slice(img.length - 4)==".jpg" || data[x].data.title != undefined)
                var title = data[x].data.title
                var link = "https://reddit.com"+ data[x].data.permalink
                ans[data[x].data.name] = {
                    img, title, link
                }
                try{
                download(img, "C:/Users/Asus/Projects/Trendgetter/img/movie/"+name+".jpg", function(){console.log(img + " downloaded")})
                }
                finally{continue}
              }
          finally{continue}
          }
        }
        return ans
    }

    var download = function(uri, filename, callback){
      name+= 1
      request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
      
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
      });
      };