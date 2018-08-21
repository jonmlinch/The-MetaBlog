var express = require('express');
var router = express.Router();
var db = require('../models')

router.get('/', function(req, res){
	db.article.findAll().then(function(allArticles){
		res.render('articles/articles', {articles: allArticles})
	}).catch(function(err){
		console.log(err);
		res.send('bad things happened')
	})
});

router.get('/new', function(req, res){
	db.author.findAll().then(function(allAuthors){
		res.render('articles/new', {authors: allAuthors})
	}).catch(function(err){
		console.log(err);
		res.render('error')
	});
});

router.get('/:id', function(req, res){
	db.article.findOne({
		where: {id: req.params.id},
		include: [db.author, db.comment, db.tag]
	}).then(function(foundArticle){
		db.author.findAll().then(function(allAuthors){
			res.render('articles/show', {article: foundArticle, authors: allAuthors})
		}).catch(function(err){
			console.log(err);
			res.render('error')
		})
	}).catch(function(err){
		console.log(err);
		res.render('error')
	})
});

router.post('/', function(req, res){
	console.log(req.body);
	if(req.body.authorId > 0){
		db.article.create(req.body).then(function(createdArticle){
			var tags = [];
			if(req.body.tags){
				tags = req.body.tags.split(',');
			}
			if(tags.length > 0){
				//loop through each tag, create if needed, add relation to join table
				tags.forEach(function(t){
					db.tag.findOrCreate({
						where: {name: t.trim()}
					}).spread(function(newTag, wasCreated){
						createdArticle.addTag(newTag)
					})
				}) 
				res.redirect('/articles/' + createdArticle.id)
			}
			else {
				res.redirect('/articles/' + createdArticle.id);
			}
		}).catch(function(err){
			console.log(err);
			res.render('error')
		})
	} else {
		res.redirect('articles/new')
	}
	
});

module.exports = router;