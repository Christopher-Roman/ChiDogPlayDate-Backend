const express 	= require('express');
const router 	= express.Router();
const User 		= require('../models/user');
const Photo 	= require('../models/photo');
const multer	= require('multer');

const storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads/');
	},
	filename: function(req, file, callback) {
		callback(null, `${Date.now()} ${file.originalname}`);
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

// Photo Get Route

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

router.post('/new', upload.single('photoUrl'), async (req, res, next) => {
	if(req.session.logged) {
		try {
			const photoEntry = {};
			photoEntry.photoUrl = req.file.path;
			photoEntry.createdBy = req.session.username;
			photoEntry.description = req.body.description;

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


module.exports = router