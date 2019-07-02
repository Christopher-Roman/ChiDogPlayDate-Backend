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
		console.log(req.session);
		try {
			const foundUser = await User.findOne({username: req.session.username});
			console.log(foundUser);
			console.log('========== Found User ==========');
			console.log(req.session);
			console.log('========== req.session ==========');
			if(foundUser) {
				console.log('making it past foundUser if statement');
				const postEntry = {};
				postEntry.postTitle = req.body.postTitle;
				postEntry.postBody = req.body.postBody;
				postEntry.comment = [];
				postEntry.createdBy = req.session.username;

				const newPost = await Post.create(postEntry);
				console.log(newPost);
				console.log('========== New Post ==========');

				foundUser.post.push(newPost);
				await foundUser.save()
				res.json({
					status: 200,
					data: newPost
				})
			}
		} catch(err) {
			res.json({
				data: err
			})
		}
	} else {
		res.json({
			status: 403,
			data: 'You must be logged in to do this.'
		})
	}
})



module.exports = router;