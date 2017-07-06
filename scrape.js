var request = require('request');
var cheerio = require('cheerio');
var Q 		= require('q');

var fc_URL = 'https://www.capitalfitness.net/';
var eb_URL = 'http://www.eastbankclub.com/calendar/';

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
				
			});
		}
	});	
}

fetchCapitalFitness();
