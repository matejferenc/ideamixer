'use strict';

const express = require('express');
const app = express();
const db = require('./lib/db.js');
const crypto = require('crypto');
const controller = require('./controller.js');

const debug = require('debug')('ideamixer');
const config = require('./config.js');
const port = 8880;
const strings = {
	serverError: 'Internal server error!',
	invalidRating: 'Invalid rating.',
	ratingSaved: 'Rating successfully saved to db.'
};

// TODO logger
const error = console.error;

// middleware
const helmet = require('helmet');
app.use(helmet());

const cookieParser = require('cookie-parser');
app.use(cookieParser(config.cookieSecret));

//const history = require('connect-history-api-fallback');
//app.use(history());

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
	extended: true
}));


/**
 * User cookie middleware.
 * If the user has uuid cookie, skips, otherwise generate new random uuid.
 */
app.use(userCookie);

function userCookie(req, res, next) {
	if (!req.cookies) return next(new Error('Problem with cookie-parser module, no cookie object.'));
	if (!req.cookies.uuid) {
		newUser((err, uuid) => {
			if (err) return next(err);
			res.cookie('uuid', uuid);
			next();
		});
	} else {
		next();
	}
}

function newUser(cb) {
	var randomHex = crypto.randomBytes(16).toString('hex'); //random new user id
	db((err, db) => {
		if (err) return cb(err);
		db.collection(config.db.users).findOne({ //check if already exists
			uuid: randomHex
		}, (err, user) => {
			if (!user || user.length === 0) { //create new user
				db.collection(config.db.users).insertOne({
					uuid: randomHex
				}, (err) => {
					db.close();
					if (err) return cb(err);
					return cb(null, randomHex);
				});
			} else { //repeat until uuid is unique
				db.close(); //innefective but this code should basically never run
				return newUser((err, uuid) => {
					if (err) return cb(err);
					return cb(null, uuid);
				});
			}
		});
	});
}


/**
 * Start server.
 */
app.use(express.static('xsicht/dist'))
app.listen(port, () => {
	console.log(`\n\x1b[1mServer listening on port ${port}!\n\x1b[22m`);
});



/**
 * Homepage
 */
app.get('/', controller.getHomepage);


/**
 * Endpoint for generating random idea.
 * Returns array of 2 words.
 */
app.get('/idea/generate', controller.generateTwo);


/**
 * Endpoint for generating idea based on 1 specified word, returns string.
 */
app.get('/idea/generateOne', controller.generateOne);


/**
 * Endpoint for voting.
 * If a combination of uuid and idea is found, it is updated to current vote.
 * 
 * Parameters: 
 * words - each word in separate word param
 * rating - one of 1, -1
 */
app.post('/idea/rate', controller.rate);


/**
 * Endpoint for providing user’s idea.
 * 
 * Parameters: 
 * words - contains whole user submitted string
 *
 * Desc.:
 * Stored in a separate collection per config, waiting for approval.
 * Input is validated by middleware.
 * Each input containing suspicious characters like <># will be disregarded 
 * (basically any characters that can be used to do an attack).
 */
app.post('/idea/submit', controller.submitIdea);


/**
 * Endpoint for retrieving user ideas
 */
app.get('/idea/userIdeas', controller.getUserIdeas);

app.put('/idea/userIdeas/:action/:word', controller.processUserIdea);


/**
 * Endpoint for returning user’s rating history.
 */
app.get('/idea/history', controller.getUserHistory);



/**
 * Endpoint for returning user’s submitted ideas.
 */
//app.get('/user/history', (req, res, next) => {
//	db((err, db) => {
//		if (err) return next(err);
//		db.collection('userIdeas').find({
//			user: req.cookies.uuid
//		}).toArray((err, arr) => {
//			db.close();
//			if (err) return next(err);
//			return res.send(arr);
//		});
//	});
//});


app.get('/idea/graph/:start', controller.getGraph);

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
