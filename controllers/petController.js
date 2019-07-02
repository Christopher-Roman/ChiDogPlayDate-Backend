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
				data: 'No information has been created'
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
				status: 500,
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
				status: 500,
				data: err
			})
		}
	}
})

// Pet Put Route 
router.put('/:id/update', async (req, res, next) => {
	if(req.session.logged) {
		try {
			const currentPet = await Pet.findById(req.params.id);
			const updatedPet = {};
			// Logic to handle firstname change
			if(!req.body.firstName) {
				updatedPet.firstName = currentPet.firstName;
			} else {
				updatedPet.firstName = req.body.firstName;	
			}
			
			// Logic to handle middleName change
			if(!req.body.middleName) {
				if(!currentPet.middleName) {
					updatedPet.middleName = `Does ${currentPet.firstName} have a middle name?`
				} else {
					updatedPet.middleName = currentPet.middleName;
				}
			} else {
				updatedPet.middleName = req.body.middleName;
			} 
			
			// Logic to handle lastName change
			if(!req.body.lastName) {
				if(!currentPet.lastName) {
					updatedPet.lastName = `Does ${currentPet.firstName} have a last name?`
				} else {
					updatedPet.lastName = currentPet.lastName;
				}
			} else {
				updatedPet.lastName = req.body.lastName;
			}

			// Logic to handle weight change
			if(!req.body.weight) {
				if(!currentPet.weight) {
					updatedPet.weight = `How much does ${currentPet.firstName} weigh?`
				} else {
					updatedPet.weight = currentPet.weight;
				}
			} else {
				updatedPet.weight = req.body.weight;
			}
			
			// Logic to handle age change 
			if(!req.body.age) {
				if(!currentPet.age) {
					updatedPet.age = `How old is ${currentPet.firstName}?`
				} else {
					updatedPet.age = currentPet.age;
				}
			} else {
				updatedPet.age = req.body.age;
			}
			
			// Logic to handle peopleSkills change
			if(!req.body.peopleSkills) {
				if(!currentPet.peopleSkills) {
					updatedPet.peopleSkills = `How is ${currentPet.firstName} around people?`
				} else {
					updatedPet.peopleSkills = currentPet.peopleSkills;
				}
			} else {
				updatedPet.peopleSkills = req.body.peopleSkills;
			}
			
			// Logic to handle dogSkills change
			if(!req.body.dogSkills) {
				if(!currentPet.dogSkills) {
					updatedPet.dogSkills = `How is ${currentPet.firstName} with other dogs.`
				} else {
					updatedPet.dogSkills = currentPet.dogSkills;
				}
			} else {
				updatedPet.dogSkills = req.body.dogSkills;
			}
			
			// Logic to handle favTreat change
			if(!req.body.favTreat) {
				if(!currentPet.favTreat) {
					updatedPet.favTreat = `What is ${currentPet.firstName}'s favorite treat?`
				} else {
					updatedPet.favTreat = currentPet.favTreat;
				}
			} else {
				updatedPet.favTreat = req.body.favTreat;
			}
			
			// Logic to handle favToy change
			if(!req.body.favToy) {
				if(!currentPet.favToy) {
					updatedPet.favToy = `What is ${currentPet.firstName}'s favorite toy?`
				} else {
					updatedPet.favToy = currentPet.favToy;
				}
			} else {
				updatedPet.favToy = req.body.favToy;
			}
			
			// Logic to handle favPlay change
			if(!req.body.favPlay) {
				if(!currentPet.favPlay) {
					updatedPet.favPlay = `What is ${currentPet.firstName}'s favorite game?`
				} else {
					updatedPet.favPlay = currentPet.favPlay;
				}
			} else {
				updatedPet.favPlay = req.body.favPlay;
			}
			
			// Logic to handle breed change
			if(!req.body.breed) {
				if(!currentPet.breed) {
					updatedPet.breed = `What breed is ${currentPet.firstName}?`
				} else {
					updatedPet.breed = currentPet.breed;
				}
			} else {
				updatedPet.breed = req.body.breed;
			}
			
			// Logic to handle fixed change
			if(!req.body.fixed) {
				if(!currentPet.fixed) {
					updatedPet.fixed = `Is ${currentPet.firstName} spayed or neutered?`
				} else {
					updatedPet.fixed = currentPet.fixed;
				}
			} else {
				updatedPet.fixed = req.body.fixed;
			}
			
			// Logic to handle bio change
			if(!req.params.bio) {
				if(currentPet.bio === "") {
					updatedPet.bio = `Tell us a bit about, ${currentPet.firstName}.`
				} else {
					updatedPet.bio = currentPet.bio;
				}
			} else {
				updatedPet.bio = req.body.bio;
			}
			
			// Logic to handle change to sex
			if(!req.params.sex) {
				if(!currentPet.sex) {
					updatedPet.sex = `Is ${currentPet.firstName} female or male?`
				} else {
					updatedPet.sex = req.body.sex;
				}
			} else {
				currentPet.sex = req.body.sex
			}

			updatedPet._id = currentPet._id;
			updatedPet.owner = req.session.username;

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
			next(err)
		}
	}
})

module.exports = router;