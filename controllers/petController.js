const express 	= require('express');
const router 	= express.Router();
const User 		= require('../models/user');
const Pet 		= require('../models/pet');

// Pet Get Route for all pets

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

// Pet Get Route for specific pet
router.get('/:id', async (req, res) => {
	if(req.session.logged) {
		const noPets = 'There are no pets list under that ID'
		try {
			const foundPet = await Pet.findById(req.params.id);
			if(!foundPet) {
				res.json({
					status: 204,
					data: noPets
				})
			} else {
				res.json({
					status: 200,
					data: foundPet
				})
			}
		} catch(err) {
			res.json({
				status: 400,
				data: err
			})
		}
	}
})

// Pet Post Route
router.post('/new', async (req, res) => {
	if(req.session.logged) {
		try {
			const petEntry = {};
			petEntry.firstName = req.body.firstName;
			petEntry.middleName = req.body.middleName;
			petEntry.lastName = req.body.lastName;
			petEntry.weight = req.body.weight;
			petEntry.age = req.body.age;
			petEntry.peopleSkills = req.body.peopleSkills;
			petEntry.dogSkills = req.body.dogSkills;
			petEntry.favTreat = req.body.favTreat;
			petEntry.favToy = req.body.favToy;
			petEntry.favPlay = req.body.favPlay;
			petEntry.breed = req.body.breed;
			petEntry.fixed = req.body.fixed;
			petEntry.owner = req.session.username;
			petEntry.bio = req.body.bio;
			petEntry.sex = req.body.sex;

			const newPet = await Pet.create(petEntry);
			const foundUser = await User.findOne({username: req.session.username})
			foundUser.pet.push(newPet)
			await foundUser.save()
			res.json({
				status: 200,
				data: newPet
			})
		} catch(err) {
			res.json({
				status: 400,
				data: err
			})
		}
	}
})



module.exports = router;