const express 	= require('express');
const router 	= express.Router();
const User 		= require('../models/user');
const Photo 	= require('../models/photo');

// Photo Get Route

router.get('/', async (req, res) => {
	if(req.session.logged) {
		const foundUser = await User.find({username: req.session.username});
		if(foundUser === undefined || foundUser === null) {
			res.json({
				status: 204,
				data: 'No photos have been uploaded'
			})
		} else {
			res.json({
				status: 200,
				data: foundUser
			})
		}
	}
})


module.exports = router