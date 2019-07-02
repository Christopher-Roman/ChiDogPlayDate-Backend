const express 			= require('express');
const app 				= express();
const PORT 				= process.env.PORT;
const bodyParser 		= require('body-parser');
const methodOverride 	= require('method-override');
const session 			= require('express-session');
const cors 				= require('cors');

require('dotenv').config({path:'./.env'});
require('es6-promise').polyfill();
require('isomorphic-fetch');

const User = require('./models/user');
const Pet = require('./models/pet');
const Post = require('./models/post');
const Photo = require('./models/photo');

const userController = require('./controllers/userController');
const petController = require('./controllers/petController');
const postController = require('./controllers/postController');
const photoController = require('./controllers/photoController');

require('./db/db');

app.use(session({
	secret: process.env.SECRET,
	resave: 'false',
	saveUninitialized: false
}))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

const corsOptions = {
	origin: process.env.HOST,
	credentials: true,
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use('/users', userController);
app.use('/pet', petController);
app.use('/post', postController);
app.use('/photo', photoController);

app.listen(process.env.PORT, () => {
	console.log('Server is up and running.');
})




