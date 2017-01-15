'use strict';
const util = require('util');
const MongoClient = require('mongodb').MongoClient;
const config = require('../config.js');
const debug = require('debug')('ideamixer:db');

const url = 'mongodb://' + config.db.uri;


function connect(cb) {
	cb = typeof cb === 'function' ? cb : () => {};
	MongoClient.connect(url, (err, db) => {
		if (err) return cb(err);
		debug("Connected successfully to mongodb server");
		// cb(null, db);
		// debug(db.listCollections())
		// debug(db.collection('ideaBase'))
		return cb(null, db);
		// console.err(util.inspect(err));
	});
}

module.exports = connect;

// module.exports = (cb) => {
// 	cb = typeof cb === 'function' ? cb : () => {};
// };