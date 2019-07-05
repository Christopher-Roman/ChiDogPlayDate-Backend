const express 	= require('express');
const router 	= express.Router();
const User 		= require('../models/user');
const Photo 	= require('../models/photo');
const Comment 	= require('../models/comment')
const multer	= require('multer');
const fs 		= require('fs')
const { promisify } = require('util')
const unlinkAsync 	= promisify(fs.unlink)

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

// Get Route for all user Photos
router.get('/', async (req, res) => {
	if(req.session.logged) {
		const foundPhotos = await Photo.find({createdBy: req.session.username});
		if(foundPhotos.length === 0) {
			res.json({
				status: 204,
				data: 'No photos have been uploaded'
			})
		} else {
			console.log(foundPhotos);
			res.json({
				status: 200,
				data: foundPhotos
			})
		}
	}
})

// Get Route for specific photo
router.get('/:id', async (req, res, next) => {
	if(req.session.logged) {
		try {
			noPhoto = `Photo was not found using the following ID: ${req.params.id}`
			const foundPhoto = await Photo.findById(req.params.id);
			if(!foundPhoto) {
				res.json({
					status: 204,
					data: noPhoto
				})
			} else {
				res.json({
					status: 200,
					data: foundPhoto
				})
			}
		} catch(err) {
			next(err)
		}
	}
})

// Post Route for Photos
router.post('/new', upload.single('photoUrl'), async (req, res, next) => {
	if(req.session.logged) {
		try {
			const photoEntry = {};
			photoEntry.photoUrl = req.file.path;
			photoEntry.createdBy = req.session.username;
			photoEntry.description = req.body.description;
			photoEntry.fileName = req.file.filename

			const newPhoto = await Photo.create(photoEntry);
			const currentUser = await User.findOne({username: req.session.username});
			currentUser.photo.push(newPhoto);
			await currentUser.save()
			res.json({
				status: 200,
				data: newPhoto
			})
		} catch(err) {
			next(err)
		}
	} else {
		const forbidden = 'You must be logged in to perform this action.'
		res.json({
			status: 403,
			data: forbidden
		})
	}
})

// Put Route for Photos
router.put('/:id/update', upload.single('photoUrl'), async (req, res, next) => {
	if(req.session.logged) {
		try {
			const currentPhoto = await Photo.findById(req.params.id);
			const updatedPhoto = {};
			updatedPhoto.id = req.params.id
			if(req.file.path === currentPhoto.photoUrl) {
				updatedPhoto.photoUrl = currentPhoto.photoUrl;
			} else {
				updatedPhoto.photoUrl = req.file.path;
			}
			if(req.body.description === currentPhoto.description) {
				updatedPhoto.description = currentPhoto.description;
			} else {
				updatedPhoto.description = req.body.description;
			}

			await unlinkAsync('../uploads' + currentPhoto.fileName)
			const photoWithUpdates = await Photo.findByIdAndUpdate(req.params.id, updatedPhoto, {new: true})
			await photoWithUpdates.save()
			const currentUser = await User.findOne({username: req.session.username});
			currentUser.photo.splice(currentUser.photo.findIndex((photo) => {
				return photo.id === req.params.id
			}), 1, photoWithUpdates)
			await currentUser.save()
			res.json({
				status: 200,
				data: photoWithUpdates
			})
		} catch(err) {
			next(err)
		}
	} else {
		const forbidden = 'You must be logged in to perform this action.'
		res.json({
			status: 403,
			data: forbidden
		})
	}
})

// Delete Route for Photos
router.delete('/delete/:id', async (req, res, next) => {
	try {
		console.log(req.file);
		const currentUser = await User.findOne({username: req.session.username});
		currentUser.photo.splice(currentUser.photo.findIndex((photo) => {
			return photo.id === req.params.id
		}), 1);
		const currentPhoto = await Photo.findById(req.params.id);
		console.log(currentPhoto);
		const deletedCommentIds = [];
		if(currentPhoto.comment) {
			for(let i = 0; i < currentPhoto.comment.length; i++) {
				deletedCommentIds.push(currentPhoto.comment[i].id)
			}
		}
		const deletePhoto = await Photo.findByIdAndDelete(req.params.id);
		const deletedComments = await Comment.deleteMany({
			_id: {$in: deletedCommentIds}
		});
		await currentUser.save()
		await unlinkAsync(currentPhoto.photoUrl)
		res.json({
			status: 200,
			data: currentUser
		})
	} catch(err) {
		next(err)
	}
})




module.exports = router