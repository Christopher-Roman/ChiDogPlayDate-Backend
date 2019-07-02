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
		res.json({
			status:500,
			data: err
		})
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

// Logout Get Route
router.get('/logout', (req, res, next) => {
	req.session.destroy((err) => {
		if(err) {
			res.send(err);
		} else {
			res.json({
				status: 200,
				data: 'Logout Successful'
			})
		}
	})
})

// Put Route for users
router.put('/:id/update', async (req, res) => {
	if(req.session.logged) {
		try {
			const currentUser = await User.findById(req.params.id)
			const newUserInfo = {};

			// Logic to handle username changes
			if(!req.body.username) {
				newUserInfo.username = currentUser.username
			} else {
				newUserInfo.username = req.body.username;
			}

			// Logic to handle email changes
			if(!req.body.emailAddress) {
				if(!currentUser.emailAddress) {
					newUserInfo.emailAddress = "Don't forget to add an email!"
				} else {
					newUserInfo.emailAddress = currentUser.emailAddress	
				}
			} else {
				newUserInfo.emailAddress = req.body.emailAddress;
			}

			// Logic to handle bio changes
			if(!req.body.bio) {
				if(!currentUser.bio) {
					newUserInfo.bio = "Don't forget to add a bio!";
				} else {
					newUserInfo.bio = currentUser.bio;
				}
			} else {
				newUserInfo.bio = req.body.bio;
			}

			// Logic to handle Photo Changes
			if(!req.body.userPhoto){
				if(!currentUser.userPhoto) {
					newUserInfo.userPhoto = 'You should add a photo!'
				} else {
					newUserInfo.userPhoto = currentUser.userPhoto;
				}
			} else {
				newUserInfo.userPhoto = req.body.userPhoto;
			}
			
			//Logic to handle Address Changes
			if(!req.body.address) {
				if(!currentUser.address) {
					newUserInfo.address = "Don't forget to add your address for better park searches!";
				} else {
					newUserInfo.address = currentUser.address;
				}
			} else {
				newUserInfo.address = req.body.address;
			}
			
			newUserInfo._id = req.params.id;
			newUserInfo.pet = currentUser.pet;
			newUserInfo.post = currentUser.post;
			newUserInfo.petPhoto = currentUser.petPhoto


			const userToUpdate = await User.findByIdAndUpdate(req.params.id, newUserInfo, {new: true});
			await userToUpdate.save();
			res.json({
				status: 200,
				data: userToUpdate
			})
		} catch(err) {
			next(err)
		}
	} else {
		res.json({
			status: 400,
			data: 'You must be logged in to utilize this functionality'
		})
	}
})


module.exports = router;