const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	middleName: String,
	lastName: String,
	weight: String,
	age: String,
	peopleSkills: String,
	dogSkills: String,
	favTreat: String,
	favToy: String,
	favPlay: String,
	breed: String,
	fixed: String,
	owner: String,
	bio: String,
	sex: String,
	petPhoto: String
})

module.exports = mongoose.model('Pet', petSchema)