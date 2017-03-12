module.exports = {
    getHomepage : (req, res) => {
        res.send(['/idea/generate', '/idea/generateOne']);
    },
    generateTwo : (req, res, next) => {
        getTwo((err, data) => {
            if (!err) return res.json(data);
            next(err);
        });
    },
    generateOne : (req, res, next) => {
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
    },
    rate : (req, res, next) => {
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
    },
    submitIdea : (req, res, next) => {
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
    },
    getUserIdeas : (req, res, next) => {
       db((err, db) => {
           if (err) return next(err);
           db.collection(config.db.userIdeas).find().toArray((err, arr) => {
               if (err) return next(err);
               db.close();
               return res.send(arr);
           });
       });
   },
   processUserIdea : (req, res, next) => {
        var action = req.params.action;
        var word = req.params.word;
        db((err, db) => {
            if (err) return next(err);
            if (action === 'approve') {
                db.collection(config.db.userIdeas).remove({
                    idea: word
                }, (err, result) => {
                    if (err) {
                        db.close();
                        return cb(err);
                    }
                    db.collection(config.db.ideaBase).insertOne({
                        idea: word
                    }, (err, result) => {
                        db.close();
                        if (err) return cb(err);
                        return res.status(200).send();
                    });
                });
            } else if (action === 'reject') {
                db.collection(config.db.userIdeas).remove({
                    idea: word
                }, (err, result) => {
                    if (err) {
                        db.close();
                        return cb(err);
                    }
                    db.collection(config.db.ratings).remove({
                        words: {
                            '$elemMatch': {
                                '$eq': word
                            }
                        }
                    }, (err, result) => {
                        db.close();
                        if (err) return cb(err);
                        return res.status(200).send();
                    });
                });
            }
        });
   },
   getUserHistory : (req, res, next) => {
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
   },
   getGraph : (req, res, next) => {
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
     }
}


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

