const express 	= require('express');
const router 	= express.Router();
const User 		= require('../models/user');
const Post 		= require('../models/post');
const Comment 	= require('../models/comment');

// Post Get Route for all posts
router.get('/', async (req, res) => {
	if(req.session.logged) {
		const foundUser = await User.find({username: req.session.username})
		if(foundUser === undefined || foundUser === null){
			res.json({
				status: 204,
				data: 'No budgets have been created'
			})
		} else {
			res.json({
				status: 200,
				data: foundUser
			})
		}
	}
})

// Post Get Route for specific post
router.get(':id', async (req, res) => {
	if(req.session.logged) {
		const noPost = 'There is no post under that ID'
		const foundPost = await Post.findById(req.params.id);
		if(!foundPost) {
			res.json({
				status: 204,
				data: noPost
			})
		} else {
			res.json({
				status: 200,
				data: foundPost
			})
		}
	}
})

// Post Post Route
router.post('/new', async (req, res) => {
	if(req.session.logged) {
		try {
			const foundUser = await User.findOne({username: req.session.username});
			if(foundUser) {
				const postEntry = {};
				postEntry.postTitle = req.body.postTitle;
				postEntry.postBody = req.body.postBody;
				postEntry.comment = [];
				postEntry.createdBy = req.session.username;

				const newPost = await Post.create(postEntry);

				foundUser.post.push(newPost);
				await foundUser.save()
				res.json({
					status: 200,
					data: newPost
				})
			}
		} catch(err) {
			res.json({
				status: 500,
				data: err
			})
		}
	} else {
		const forbidden = 'You must be logged in to do this.'
		res.json({
			status: 403,
			data: forbidden
		})
	}
})

// Post Put Route
router.put('/:id/update', async (req, res, next) => {
	if(req.session.logged) {
		try {
			const foundUser = await User.findOne({username: req.session.username})
			const updatedPostEntry = {};
			updatedPostEntry.postTitle = req.body.postTitle;
			updatedPostEntry.postBody = req.body.postBody;
			updatedPostEntry._id = req.params.id

			const postToUpdate = await Post.findByIdAndUpdate(req.params.id, updatedPostEntry, {new: true});
			await postToUpdate.save();
			let updatedUser = foundUser;
			updatedUser.post.splice(updatedUser.post.findIndex((post) => {
				return post.id === postToUpdate.id
			}), 1, postToUpdate)
			await updatedUser.save()
			res.json({
				status: 200,
				data: updatedUser
			})
		} catch(err) {
			next(err)
		}
	}
})

module.exports = router;