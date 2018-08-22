var express = require('express');
var router = express.Router();
var db = require('../models');
var async = require('async');

router.get('/', function(req, res){
	db.tag.findAll().then(function(tags){
		res.render('tags/index', {tags: tags})
	}).catch(function(err){
		console.log(err);
		res.render('error')
	})
});

router.get('/:id', function(req,res){
	db.tag.findOne({
		where: {id: req.params.id},
		include: [db.article]
	}).then(function(tag){
		res.render('tags/show', {tag: tag});
	}).catch(function(err){
		console.log(err);
		res.render('error')
	})
});

router.get('/edit/:id', function(req, res){
	db.tag.findById(req.params.id).then(function(foundTag){
		res.render('tags/edit', {tag: foundTag});
	}).catch(function(err){
		console.log(err)
		res.render('error')
	});
});

router.put('/:id', function(req, res){
	res.send(req.body);
});

router.delete('/:id', function(req, res){
	db.tag.findOne({
		where: { id: req.params.id },
		include: [db.article]
	}).then(function(foundTag){
		async.forEach(foundTag.articles, function(a, done){
			//runs for each article
			//remove the association from the join table
			foundTag.removeArticle(a).then(function(){
				done();
			});
		}, function(){
			//runs when everything is done
			//now that the references to the join table are gone, I can freely delete the tag
			db.tag.destroy({
				where: {id: req.params.id}
			}).then(function(){
				res.send('successfully deleted')
			}).catch(function(err){
				res.status(500).send('oh nooo!')
			})
		})
	}).catch(function(err){
		res.status(500).send('Oh NOOOO!');
	})
})

module.exports = router;