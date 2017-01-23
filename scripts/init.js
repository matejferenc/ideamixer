const db = require('../lib/db.js');
const fs = require('fs');
const config = require('../config.js');
const debug = require('debug')('ideamixer');

const collection = 'ideaBase';

fs.readFile('./input.txt', 'utf8', (err, data) => {
	if (err) return console.err(err);
	data = data.split('\n');
	data = data.map((v) => {
		return {
			idea: v.replace(/\r/g, '')
		};
	});
	db((err, db) => {
		if (err) return console.err(err);
		var col = db.collection(collection);
		col.insertMany(data, (err, result) => {
			if (err) return console.err(err);
			debug(result);
			var arr = [
				config.db.ideaBase,
				config.db.users,
				config.db.rankings,
				config.db.userIdeas
			];
			return arr.map((v) => {
				db.createCollection(v, debug);
				return;
			});
		});
	});
});