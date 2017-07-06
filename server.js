var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var router = express.Router();

var Schema = mongoose.Schema;

var classSchema = new Schema({
	title: String,
	time: String,
	length: String,
	room: String,
	building: String
});
var Class = mongoose.model('Class', classSchema);

var fc_URL = 'https://www.capitalfitness.net/';

function fetchCapitalFitness() {

	request(fc_URL, function(error, response, html) {
		if(!error && response.statusCode == 200) {

			var $ = cheerio.load(html);

			var header = $('#block-views-class-schedule-block').find('h2');
			var date = $(header).next().find('.view-header').find('.date-today');
			var item = $(header).next().find('.view-content').find('.views-row');

			console.log(header.text());
			console.log(date.text());

			$(item).each(function(i, element) {
				var time = $(this).find('.time');
				var length = $(this).find('.length');
				var title = $(this).find('.title').children('a');
				var notes = $(this).find('.title').children('.class-schedule-pop-up').find('.field-content');

				var desc = $(notes).find('.class').children().find('.field-content').children('p').text();
				var room = $(notes).find('.day').children('.room').text();
				var building = $(notes).find('.day').children('.building').text();
				
				console.log(time.text());
				console.log(length.text());
				console.log(title.text());
				console.log(room);
				console.log(building);
				console.log(desc);

				var f_class = new Class();
 				f_class.title = title.text();
 				f_class.time = time.text();
 				f_class.length = length.text();
 				f_class.room = room;
 				f_class.building = building;

 				f_class.save(function(err) {
 					if(err) res.send(err);
 				});
				
			});
		}
	});	
}
/**
 * ======================================================================
 * CONFIG
 * ======================================================================
 */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
}

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/outlook");

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
	console.log("Connected to DB");
});


/**
 * ======================================================================
 * TRACKING
 * ======================================================================
 */

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));


/**
 * ======================================================================
 * ROUTES
 * ======================================================================
 */

 router.route('/seed')
 .post(function(req, res) {
 	request(fc_URL, function(error, response, html) {
		if(!error && response.statusCode == 200) {

			var $ = cheerio.load(html);

			var header = $('#block-views-class-schedule-block').find('h2');
			var date = $(header).next().find('.view-header').find('.date-today');
			var item = $(header).next().find('.view-content').find('.views-row');

			console.log(header.text());
			console.log(date.text());

			$(item).each(function(i, element) {
				var time = $(this).find('.time');
				var length = $(this).find('.length');
				var title = $(this).find('.title').children('a');
				var notes = $(this).find('.title').children('.class-schedule-pop-up').find('.field-content');

				var desc = $(notes).find('.class').children().find('.field-content').children('p').text();
				var room = $(notes).find('.day').children('.room').text();
				var building = $(notes).find('.day').children('.building').text();
				
				// console.log(time.text());
				// console.log(length.text());
				// console.log(title.text());
				// console.log(room);
				// console.log(building);
				// console.log(desc);

				var f_class = new Class();
 				f_class.title = title.text();
 				f_class.time = time.text();
 				f_class.length = length.text();
 				f_class.room = room;
 				f_class.building = building;

 				f_class.save(function(err) {
 					if(err) res.send(err);
 				});
			});
		}
	});

	res.send("Success");
 });

 router.route('/classes')
 .get(function(req, res) {
	Class.find(function(err, classes) {
		if(err) res.send(err);
		else { res.json(classes); }
	});
 });

 router.route('/clean')
 .post(function(req, res) {
 	Class.remove({}, function(err) {
 		if(err) res.send(err);
 		else {
 			res.send('success');
 		}
 	});
 });

 app.use('/apiv1', router);

/**
 * ======================================================================
 * FINAL SETUP
 * ======================================================================
 */

server.listen(process.env.PORT || '8000');

