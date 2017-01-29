const db = require('../lib/db.js');
const fs = require('fs');
const config = require('../config.js');
const debug = require('debug')('ideamixer');

const collection = 'ideaBase';

fs.readFile('./input.txt', 'utf8', (err, data) => {
	if (err) throw err;
	data = data.split('\n');
	data = data.map((v) => {
		return {
			idea: v.replace(/\r/g, '')
		};
	});
	db((err, db) => {
		if (err) throw err;
		var col = db.collection(collection);
		data.forEach((v) => {
//		    col.remove(v, (err, result) => {
//                if (err) throw err;
//                debug(result);
//            });
            col.save(v, (err, result) => {
                if (err) throw err;
                debug(result);
            });
		});
//	    process.exit();
	});
});