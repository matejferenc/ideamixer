'use strict';

const express = require('express');
const app = express();
const db = require('./lib/db.js');

const debug = require('debug')('ideamixer');
const config = require('./config.js');
const port = 80;
const strings = {
	serverError: 'Internal server error!',
	invalidRanking: 'Internal server error!'
};

// TODO logger
const error = console.error;

// middleware
const helmet = require('helmet');
app.use(helmet());

const session = require('express-session'); //https://www.npmjs.com/package/express-session
const MongoStore = require('connect-mongo')(session); //https://www.npmjs.com/package/connect-mongo

app.use(session({
	secret: config.cookieSecret,
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		secure: true,
		sameSite: true
	},
	store: new MongoStore({
		url: 'mongodb://' + config.db.uri
	})
}));

const csurf = require('csurf'); //https://www.npmjs.com/package/csurf

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: false
}));



/**
 * Start server.
 */
app.listen(port, () => {
	console.log(`\n\x1b[1mServer listening on port ${port}!\n\x1b[22m`);
});



/**
 * Homepage
 */
app.get('/', (req, res) => {
	res.send(['/idea/generate', '/idea/generateOne']);
});



/**
 * Endpoint for generating random idea
 * returns 2 words
 */
app.get('/idea/generate', (req, res, next) => {
	getTwo((err, data) => {
		if (!err) return res.json(data);
		next(err);
	});
});


function getTwo(cb) {
	db((err, db) => {
		if (err) return cb(err);
		db.collection(config.db.ideaBase)
			.aggregate([{
				$sample: {
					size: 2
				}
			}])
			.toArray((err, arr) => {
				if (err) {
					error(err);
					return cb(err);
				}
				if (arr[0].idea !== arr[1].idea) {
					db.close();
					return cb(null, arr[0].idea + ' with ' + arr[1].idea);
				} else {
					return getTwo(cb);
				}
			});
	});
}



/**
 * Endpoint for generating idea based on 1 specified word
 * returns 1 word
 */
app.get('/idea/generateOne', (req, res, next) => {
	db((err, db) => {
		if (err) next(err);
		db.collection(config.db.ideaBase)
			.aggregate([{
				$sample: {
					size: 1
				}
			}])
			.toArray((err, arr) => {
				if (err) return next(err);
				db.close();
				return res.json(arr[0].idea);
			});
	});
});



/**
 * Endpoint for voting
 * parameters: 2 words, voting (1 of 3 values: GOOD, BAD, NONSENSE)
 */
app.post('/idea/rate', (req, res, next) => {
	db((err, db) => {
		if (err) return next(err);
		var ranking = validateRanking(req.body.ranking);
		if (!ranking) next(new Error(strings.invalidRanking));
		db.collection(config.db.rankings).insertOne({
			words: req.body.words,
			user: req.body.fingerprint,
			ranking: req.body.ranking
		}, (err) => {
			if (err) next(err);
			debug(req.body);
			db.close();
			return res.send(req.body);
		});

	});
});


function validateRanking(ranking) {
	if (ranking === 'GOOD' ||
		ranking === 'BAD' ||
		ranking === 'NONSENSE' ||
		ranking === 'FUNNY') {
		return ranking;
	} else {
		return false;
	}
}



/**
 * Endpoint for providing user’s idea
 * parameters: 1 word
 * will be stored in a separate table/collection waiting for approval
 * the input must be validated
 * each input containing suspicious characters like <># will be disregarded
 * basically any characters that can be used to do an attack
 */
app.post('/idea/submit', (req, res, next) => {
	db((err, db) => {
		if (err) return next(err);
		db.collection('userIdeas').insertOne({
			words: req.body.words,
			user: req.body.fingerprint
		}, (err) => {
			if (err) next(err);
			debug(req.body);
			db.close();
			return res.send(req.body);
		});
	});
});



/**
 * Endpoint for returning user’s rating
 * only for logged-in users
 */
app.get('/idea/history', (req, res) => {
	res.send('TODO');
});



/**
 * 404
 */
app.use((req, res) => {
	res.status(404).send('404\n:\'(');
});



/**
 * 500
 */
app.get('/500', (req, res) => {
	res.status(500).send(strings.serverError);
});

app.use((err, req, res, next) => {
	if (res.headersSent) {
		return next(err);
	}
	error(err);
	res.status(500).send(strings.serverError);
});