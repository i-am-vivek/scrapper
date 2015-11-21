var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var mongoskin=require("mongoskin");
var router = require('./router');
var db = mongoskin.db('mongodb://localhost:27017/task', {safe:true}); // create db instance
var jade=require("jade");
var bodyParser=require('body-parser'); //parsing body
var ObjectID = mongoskin.ObjectID;

app.use(express.static(__dirname + '/public'));//setting static path as public folder. here we put files that are needed view files.
app.set('views', __dirname + '/views');//set view path. all view files will be stored in this folder
app.set('view engine', 'jade'); //initiate view engine into framework
app.set(bodyParser.json());//get query string as json
app.use(bodyParser.urlencoded({ extended: true }));//encoding url
app.get('/', function(req, res){
	res.render("index");
});
app.get('/Hashes', function(req, res){
		db.collection('Hash').find().toArray(function(err, result) {
			if(err || !result){
				res.type("json");
				res.write('{"status":"0","message":"Error in fetching"}');
				res.end();
			}
			else{
				res.type("json");
				object={};
				object.status=1;
				object.message="fetched data succesfully";
				object.data=result;
				res.json(object);
				res.end();
			}
		});
});
app.get('/GrabHash/:title', function(req, res){
url = 'http://stackoverflow.com/tags/'+req.params.title+'/info';
console.log(url);
  request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
			var title, release, rating;
			var json = {};
			
			var qinfo=$('#qinfo');
			json.title = $('.welovestackoverflow').find("p").text().trim();
			json.answered = $('.summarycount.al').text().trim();
			json.created = qinfo.first("tr").find("td").eq(1).text().trim();
			json.viewed = qinfo.first("tr").find("td").eq(3).text().trim();
			json.active = qinfo.first("tr").find("td").eq(5).text().trim();
			json.editors = qinfo.first("tr").find("td").eq(7).text().trim();
			console.log(json);
			db.collection('Hash').update({tag:req.params.title},{$set:json},function(err, result){
				if(err){
					res.type("json");
					res.write('{"status":"0","message":"Error in Insertion"}');
					res.end();
				}
				else{
					res.type("json");
					res.write('{"status":"1","message":"Hash updated succesfully"}');
					res.end();
				}
			
			});
        }
    });
});
app.get('/scrape', function(req, res){
url = 'http://stackoverflow.com/questions/tagged/c%23';
  request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var title, release, rating;
            var json = { title : "", release : "", rating : ""};

            // We'll use the unique header class as a starting point.

            $('.header').filter(function(){

           // Let's store the data we filter into a variable so we can easily see what's going on.

                var data = $(this);

           // In examining the DOM we notice that the title rests within the first child element of the header tag. 
           // Utilizing jQuery we can easily navigate and get the text by writing the following code:

                title = data.children().first().text();

           // Once we have our title, we'll store it to the our json object.

                json.title = title;
                res.json(json);
                res.end();
            })
        }
    });
})

app.listen('3000')

console.log('Magic happens on port 8081');

exports = module.exports = app;
