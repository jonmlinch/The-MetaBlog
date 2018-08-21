//require stuff
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var express = require('express');

//declare global variables
var app = express();

//set and use statements
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended: false}));

//Include controllers
app.use('/articles', require('./controllers/articles'));
app.use('/authors', require('./controllers/authors'));
app.use('/comments', require('./controllers/comments'))


//define routes
app.get('/', function(req, res){
	res.render('home')
})

app.get('*', function(req, res){
	console.log('wildcard route');
	res.render('error');
})

//listener
app.listen(3000);