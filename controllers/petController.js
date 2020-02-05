const express 		= require('express');
const router 		= express.Router();
const User 			= require('../models/user');
const Pet 			= require('../models/pet');
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
		const noPets = 'There are no pets listed under that ID'
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
router.post('/new',upload.single('petPhoto'), async (req, res) => {
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
			petEntry.petPhoto = req.file.path

			const newPet = await Pet.create(petEntry);
			const foundUser = await User.findOne({username: req.session.username})
			foundUser.pet.push(newPet)
			await foundUser.save()
			res.json({
				status: 200,
				data: foundUser
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
router.put('/:id/update', upload.single('petPhoto'), async (req, res, next) => {
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
				updatedPet.middleName = currentPet.middleName;
			} else {
				updatedPet.middleName = req.body.middleName;
			} 
			
			// Logic to handle lastName change
			if(!req.body.lastName) {
				updatedPet.lastName = currentPet.lastName;
			} else {
				updatedPet.lastName = req.body.lastName;
			}

			// Logic to handle weight change
			if(!req.body.weight) {
				updatedPet.weight = currentPet.weight;
			} else {
				updatedPet.weight = req.body.weight;
			}
			
			// Logic to handle age change 
			if(!req.body.age) {
				updatedPet.age = currentPet.age;
			} else {
				updatedPet.age = req.body.age;
			}
			
			// Logic to handle peopleSkills change
			if(!req.body.peopleSkills) {
				updatedPet.peopleSkills = currentPet.peopleSkills;
			} else {
				updatedPet.peopleSkills = req.body.peopleSkills;
			}
			
			// Logic to handle dogSkills change
			if(!req.body.dogSkills) {
				updatedPet.dogSkills = currentPet.dogSkills;
			} else {
				updatedPet.dogSkills = req.body.dogSkills;
			}
			
			// Logic to handle favTreat change
			if(!req.body.favTreat) {
				updatedPet.favTreat = currentPet.favTreat;
			} else {
				updatedPet.favTreat = req.body.favTreat;
			}
			
			// Logic to handle favToy change
			if(!req.body.favToy) {
				updatedPet.favToy = currentPet.favToy;
			} else {
				updatedPet.favToy = req.body.favToy;
			}
			
			// Logic to handle favPlay change
			if(!req.body.favPlay) {
				updatedPet.favPlay = currentPet.favPlay;
			} else {
				updatedPet.favPlay = req.body.favPlay;
			}
			
			// Logic to handle breed change
			if(!req.body.breed) {
				updatedPet.breed = currentPet.breed;
			} else {
				updatedPet.breed = req.body.breed;
			}
			
			// Logic to handle fixed change
			if(!req.body.fixed) {
				pdatedPet.fixed = currentPet.fixed;
			} else {
				updatedPet.fixed = req.body.fixed;
			}
			
			// Logic to handle bio change
			if(!req.body.bio) {
				updatedPet.bio = currentPet.bio;
			} else {
				updatedPet.bio = req.body.bio;
			}
			
			// Logic to handle change to sex
			if(!req.body.sex) {
				updatedPet.sex = currentPet.sex;
			} else {
				currentPet.sex = req.body.sex
			}

			if(!req.file) {
				if(!currentPet.petPhoto) {
					updatedPet.petPhoto = null;
				} else {
					updatedPet.petPhoto = currentPet.petPhoto
				}
			} else {
				await unlinkAsync(currentPet.petPhoto)
				updatedPet.petPhoto = req.file.path
			}

			updatedPet._id = currentPet._id;
			updatedPet.owner = req.session.username;

			const petToUpdate = await Pet.findByIdAndUpdate(req.params.id, updatedPet, {new: true});
			await petToUpdate.save();
			const foundUser = await User.find({username: req.session.username});
			const updatedUser = foundUser[0];
			updatedUser.pet.splice(updatedUser.pet.findIndex((pet) => {
				return pet.id === req.params.id
			}), 1, petToUpdate);
			await updatedUser.save()
			const editedPet = await Pet.find({_id: req.params.id})
			res.json({
				status: 200,
				data: updatedUser
			})
		} catch(err) {
			next(err)
		}
	}
})

// Delete Route for Pets
router.delete('/:id/delete', async (req, res, next) => {
	try {
		const currentUser = await User.findOne({username: req.session.username});
		currentUser.pet.splice(currentUser.pet.findIndex((pet) => {
			return pet.id === req.params.id
		}), 1)
		await currentUser.save()
		const deletedPet = await Pet.findByIdAndDelete(req.params.id);
		await unlinkAsync(deletedPet.petPhoto)
		res.json({
			status: 200,
			data: currentUser
		})
	} catch(err) {
		next(err)
	}
})

module.exports = router;