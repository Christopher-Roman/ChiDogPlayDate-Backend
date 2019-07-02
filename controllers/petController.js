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

// Pet Put Route 
router.put('/:id/update', async (req, res) => {
	if(req.session.logged) {
		try {
			const updatedPet = {};
			updatedPet.firstName = req.body.firstName;
			updatedPet.middleName = req.body.middleName;
			updatedPet.lastName = req.body.lastName;
			updatedPet.weight = req.body.weight;
			updatedPet.age = req.body.age;
			updatedPet.peopleSkills = req.body.peopleSkills;
			updatedPet.dogSkills = req.body.dogSkills;
			updatedPet.favTreat = req.body.favTreat;
			updatedPet.favToy = req.body.favToy;
			updatedPet.favPlay = req.body.favPlay;
			updatedPet.breed = req.body.breed;
			updatedPet.fixed = req.body.fixed;
			updatedPet.owner = req.session.username;
			updatedPet.bio = req.body.bio;
			updatedPet.sex = req.body.sex;
			updatedPet._id = req.params.id;

			const petToUpdate = await Pet.findByIdAndUpdate(req.params.id, updatedPet, {new: true});
			await petToUpdate.save();
			const foundUser = await User.find({username: req.session.username});
			const updatedUser = foundUser[0];
			updatedUser.pet.splice(updatedUser.pet.findIndex((pet) => {
				return pet.id === petToUpdate.id
			}), 1, petToUpdate);
			await updatedUser.save()
			res.json({
				status: 200,
				data: updatedUser
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