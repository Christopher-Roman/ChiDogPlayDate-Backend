const express 	= require('express');
const router 	= express.Router();
const User 		= require('../models/user');
const Pet 		= require('../models/pet');
const Post 		= require('../models/post');
const Photo 	= require('../models/photo');
const bcrypt 	= require('bcrypt')

// Register Post Route for User Creation
router.post('/register', async (req, res) => {
	try {
		const password = req.body.password;
		const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		const userEntry = {};
		userEntry.username = req.body.username;
		userEntry.password = passwordHash;
		const user = User.create(userEntry);
		req.session.username = req.body.username;
		req.session.logged = true;
		res.json({
			status: 200,
			data: user
		})
	} catch(err) {
		console.error(err)
	}
})

// Login Post Route

router.post('/login', async (req, res, next) => {
	try {
		const foundUser = await User.findOne({username: req.body.username});
		if(foundUser) {
			if(bcrypt.compareSync(req.body.password, foundUser.password)) {
				req.session.username = req.body.username;
				req.session.logged = true;
				res.json({
					status: 200,
					data: foundUser
				})
			} else {
				req.session.message = 'Username or password are incorrect.'
				res.json({
					status: 401,
					data: 'Login failed. Username or password were incorrect'
				})
			}
		} else {
			req.session.message = 'Username or password are incorrect.'
			res.json({
					status: 400,
					data: 'Login failed. Username or password were incorrect'
				})
		}
	} catch(err) {
		next(err);
	}
})

module.exports = router;