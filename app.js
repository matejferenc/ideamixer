'use strict';

const express = require('express');
const app = express();
const db = require('./lib/db.js');
const crypto = require('crypto');

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

const history = require('connect-history-api-fallback');
app.use(history());

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
app.get('/', (req, res) => {
	res.send(['/idea/generate', '/idea/generateOne']);
});



/**
 * Endpoint for generating random idea.
 * Returns array of 2 words.
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
					db.close();
					error(err);
					return cb(err);
				}
				if (arr[0].idea !== arr[1].idea) {
					db.close();
					return cb(null, [arr[0].idea, arr[1].idea]);
				} else {
					return getTwo(cb);
				}
			});
	});
}



/**
 * Endpoint for generating idea based on 1 specified word, returns string.
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
				db.close();
				if (err) return next(err);
				return res.json(arr[0].idea);
			});
	});
});



/**
 * Endpoint for voting.
 * If a combination of uuid and idea is found, it is updated to current vote.
 * 
 * Parameters: 
 * words - each word in separate word param
 * rating - one of 1, -1
 */
app.post('/idea/rate', (req, res, next) => {
	db((err, db) => {
		if (err) return next(err);
		error(JSON.stringify(req.body));
		var rating = validateRating(req.body.rating);
		if (!rating) return invalidRating(req, res);
		db.collection(config.db.ratings).findOne({
			words: req.body.words,
			user: req.cookies.uuid,
		}, (err, result) => {
			if (err) return next(err);
			//this user has not yet ranked this idea
			if (!result) {
				db.collection(config.db.ratings).insertOne({
					words: req.body.words,
					user: req.cookies.uuid,
					rating: rating,
					timestamp: new Date()
				}, (err) => {
					db.close();
					if (err) next(err);
					return res.status(200).send();
				});

			} else if (result.rating !== rating) { // this user changed his rating of this idea
				db.collection(config.db.ratings).update({
					_id: result._id
				}, {
					$set: {
						rating: rating,
						timestamp: new Date()
					}
				}, (err) => {
					db.close();
					if (err) next(err);
					return res.status(200).send();

				});
			} else { // duplicate rating, skipping db ops
				db.close();
				return res.status(200).send();
			}
		});
	});
});



function validateRating(rating) {
	if (rating === '1' ||
		rating === '-1') {
		return parseInt(rating, 10);
	} else {
		return false;
	}
}

function invalidRating(req, res) {
	error(new Error(strings.invalidRating + " " + JSON.stringify(req.body)));
	res.status(200).send();
}



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
app.post('/idea/submit', (req, res, next) => {
	db((err, db) => {
		if (err) return next(err);
		db.collection(config.db.ideaBase).findOne({
			idea: req.body.idea
		}, (err, result) => {
			if (!result) {
				db.collection(config.db.userIdeas).findOne({
					idea: req.body.idea
				}, (err, result) => {
					if (!result) {
						db.collection(config.db.userIdeas).insertOne({
							idea: req.body.idea,
							user: req.cookies.uuid
						}, (err) => {
							if (err) next(err);
							db.close();
							return res.send(req.body);
						});
					} else {
						// idea already exists
						db.close();
						res.status(200).send('already pending');
					}
				});
			} else {
				db.close();
				res.status(200).send('already in database');
			}
		});
	});
});



/**
 * Endpoint for retrieving user ideas
 */
app.get('/idea/userIdeas', (req, res, next) => {
    db((err, db) => {
        if (err) return next(err);
        db.collection(config.db.ideaBase).find().toArray((err, arr) => {
            if (err) return next(err);
            db.close();
            return res.send(arr);
        });
    });
});


/**
 * Endpoint for returning user’s rating history.
 */
app.get('/idea/history', (req, res, next) => {
	db((err, db) => {
		if (err) return next(err);
		db.collection(config.db.ratings).find(
		    {user: req.cookies.uuid},
		    {words: true, rating: true, "_id": false}
		).toArray((err, arr) => {
			if (err) return next(err);
			db.close();
			return res.send(arr);
		});
	});
});



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


app.get('/idea/graph/:start', (req, res, next) => {
	var start = req.params.start;
	db((err, db) => {
		if (err) return next(err);
		var group = 0;
		var nodes = addNodes([], [start], group);
		findGrouped(db, start, function(links) {
			group = 1;
			nodes = addNodes(nodes, links.map(link => link.target), group);
			var allLinks = links;
			var promises = links.map(function(e) {
				return new Promise(function(resolve, reject) {
					findGrouped(db, e.target, function(secondLinks) {
						secondLinks = secondLinks.filter(function(item) {
							return item.target != start;
						});
						allLinks = allLinks.concat(secondLinks);
						group = 2;
						nodes = addNodes(nodes, secondLinks.map(link => link.target), group);
						resolve();
					}, function() {
						db.close();
						reject();
					});
				});
			});

			Promise.all(promises).then(function() {
				db.close();
				return res.send({"nodes": nodes, "links": allLinks});
			}).catch(error);
		}, function() {
			db.close();
		});
	});
});

function addNodes(nodes, words, group) {
	words.forEach(word => {
		if (!nodes.some(node => node.id == word)) {
			nodes.push({"id": word, "group": group})
		}
	});
	return nodes;
}

function findGrouped(db, start, cb, fail) {
	db.collection(config.db.ratings).aggregate([
		{
			'$match': {
				words: {
					'$elemMatch': {
						'$eq': start
					}
				}
			}
		},
		{
			'$group': {
				'_id': '$words',
				rating: {'$sum': '$rating'}
			}
		}
	]).toArray((err, arr) => {
		if (err) {
			fail();
		}
		var links = [];
		arr.forEach(function(e){
			var rating = 0;
			links = links.reduce(function(reduced, item) {
				if (item.source == e["_id"][1] && item.target == e["_id"][0]) {
					//if we find rating which is swapped (i.e. has 'start' as the second parameter)
					//we remove the element from links and remember its rating
					rating = item.value;
				} else {
					reduced.push(item);
				}
				return reduced;
			}, []);
			var secondWord;
			if (e["_id"][0] == start) {
				secondWord = e["_id"][1];
			} else if (e["_id"][1] == start) {
				secondWord = e["_id"][0];
			} else {
				fail();
			}
			links.push({"source": start, "target": secondWord, "value": e["rating"] + rating});
		});
		links = links.filter(function(item) {
			return item.value > 0;
		});
		cb(links);
	});
}


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
