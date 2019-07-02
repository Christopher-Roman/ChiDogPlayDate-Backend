const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
	firstName: {
		type: String,
		require: true
	},
	middleName: String,
	lastName: String,
	weight: Number,
	age: Number,
	peopleSkills: String,
	dogSkills: String,
	favTreat: String,
	favToy: String,
	favPlay: String,
	breed: String,
	fixed: String,
	owner: String,
	bio: String
})

module.exports = mongoose.model('Pet', petSchema)