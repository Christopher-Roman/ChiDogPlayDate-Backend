const express 		= require('express');
const router 		= express.Router();
const User 			= require('../models/user');
const Pet 			= require('../models/pet');


// 403 response
const forbidden = 'You must be logged in to perform this action.'

// Get request for all other user's pets

router.get('/', async (req, res) => {
	if(req.session.logged) {
		const allPets = await Pet.find({owner: {$ne: req.session.username}})
		if(!allPets) {
			res.json({
				status: 204,
				data: 'No Posts have been created'
			})
		} else {
			res.json({
				status: 200,
				data: allPets
			})
		}
	}
})

module.exports = router;