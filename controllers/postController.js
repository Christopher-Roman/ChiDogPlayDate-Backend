const express 		= require('express');
const router 		= express.Router();
const User 			= require('../models/user');
const Post 			= require('../models/post');
const Comment 		= require('../models/comment');
const multer		= require('multer');
const fs 			= require('fs')
const { promisify } = require('util')
const unlinkAsync 	= promisify(fs.unlink)


//============================================================//
//															  //
//		Configuration for Multer File Uploader.               //
//															  //
//============================================================//

const storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads/');
	},
	filename: function(req, file, callback) {
		callback(null, `${file.originalname} - ${Date.now()}`);
	}
})
const fileFilter = (req, file, callback) => {
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'|| file.mimetype === 'image/jpg'|| file.mimetype === 'image/gif') {
		callback(null, true)
	} else {
		callback(new Error('File type is not supported.'), false);
	}
}
const upload = multer({
	storage: storage, 
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
})

//================== End of Multer Config ==============================//

//============================================================//
//															  //
//		These are the routes for Post's specifically          //
//															  //
//============================================================//

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
router.get('/:id', async (req, res) => {
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
			const currentPost = await Post.findById(req.params.id)
			const updatedPostEntry = {};

			// Logic for title update
			if(!req.body.postTitle) {
				updatedPostEntry.postTitle = currentPost.postTitle;
			} else {
				updatedPostEntry.postTitle = req.body.postTitle;
			}

			// Logic for body update
			if(!req.body.postBody) {
				updatedPostEntry.postBody = currentPost.postBody
			} else {
				updatedPostEntry.postTitle = req.body.postbody;
			}

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

// Delete Route for Posts
router.delete('/delete/:id', async (req, res, next) => {
	try {
		const currentUser = await User.findOne({username: req.session.username});
		currentUser.post.splice(currentUser.post.findIndex((post) => {
			return post.id === req.params.id
		}), 1)
		const foundPost = await Post.findById(req.params.id);
		let deletedCommentIds = [];
		for(let i = 0; i < foundPost.comment.length; i++) {
			deletedCommentIds.push(foundPost.comment[i].id);
		}
		const deletedPost = await Post.findByIdAndDelete(req.params.id);
		const deletedComments = await Comment.deleteMany({
			_id: {$in: deletedCommentIds}
		})
		await currentUser.save()
		res.json({
			status: 200,
			data: currentUser
		})
	} catch(err) {
		next(err)
	}
})

//============================================================//
//															  //
//		These are the routes for Comments's specifically      //
//															  //
//============================================================//


// Post Route for Comments

router.post('/:id/comment/new', upload.single('photo'), async (req, res, next) => {
	if(req.session.logged) {
		try {
			const foundPost = await Post.findById(req.params.id);
			const commentToAdd = {}
			commentToAdd.commentBody = req.body.commentBody;
			commentToAdd.createdBy = req.session.username;
			if(req.file) {
				commentToAdd.photo = req.file.path
			} else {
				commentToAdd.photo = null
			}

			const newComment = await Comment.create(commentToAdd);
			foundPost.comment.push(newComment)
			await foundPost.save()
			res.json({
				status: 200,
				data: foundPost
			})
		} catch(err) {
			next(err)
		}
	} else {
		res.json({
			status: 400,
			data: 'You must be logged in to perform this action'
		})
	}
})


// Put Route for Comments
router.put('/:id/comment/:index/update', upload.single('photo'), async (req, res, next) => {
	try {
		const currentPost = await Post.findById(req.params.id);
		const currentComment = await Comment.findById(req.params.index);
		const updatedComment = {}
		updatedComment.commentBody = req.body.commentBody;
		if(!req.file) {
			if(!currentComment.photo) {
				updatedComment.photo = null
			} else {
				updatedComment.photo = currentComment.photo
			}
		} else {
			await unlinkAsync(currentComment.photo)
			updatedComment.photo = req.file.path
		}

		const commentToUpdate = await Comment.findByIdAndUpdate(req.params.index, updatedComment, {new: true});
		await commentToUpdate.save()
		const foundPost = await Post.findById(req.params.id);
		foundPost.comment.splice(foundPost.comment.findIndex((comment) => {
			return comment.id === commentToUpdate.id
		}), 1, commentToUpdate)
		await foundPost.save()
		res.json({
			status: 200,
			data: foundPost
		})
	} catch(err) {
		next(err)
	}
})

// Delete Route for Comments
router.delete('/:id/comment/:index/delete', async (req, res, next) => {
	try {
		const currentComment = await Comment.findById(req.params.index)
		if(currentComment.photo) {
			await unlinkAsync(currentComment.photo)
		}
		const currentPost = await Post.findById(req.params.id);
		currentPost.comment.splice(currentPost.comment.findIndex((comment) => {
			return comment.id === req.params.index
		}), 1);
		const deletedComment = await Comment.findByIdAndRemove(req.params.index);
		await currentPost.save()
		res.json({
			status: 200,
			data: currentPost
		})
	} catch(err) {
		next(err)
	}
})







module.exports = router;