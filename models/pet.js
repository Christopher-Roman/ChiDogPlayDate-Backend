const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	middleName: {
		type: String,
		default: "Edit Pet to Update!"
	}, 
	lastName: {
		type: String,
		default: "Edit Pet to Update!"
	},
	weight: {
		type: String,
		default: "Edit Pet to Update!"
	},
	age: {
		type: String,
		default: "Edit Pet to Update!"
	},
	peopleSkills: {
		type: String,
		default: "Edit Pet to Update!"
	},
	dogSkills: {
		type: String,
		default: "Edit Pet to Update!"
	},
	favTreat: {
		type: String,
		default: "Edit Pet to Update!"
	},
	favToy: {
		type: String,
		default: "Edit Pet to Update!"
	}, 
	favPlay: {
		type: String,
		default: "Edit Pet to Update!"
	}, 
	breed: {
		type: String,
		default: "Edit Pet to Update!"
	}, 
	fixed: {
		type: String,
		default: "Edit Pet to Update!"
	}, 
	owner: String,
	bio: {
		type: String,
		default: "Edit Pet to Update!"
	}, 
	sex: {
		type: String,
		default: "Edit Pet to Update!"
	}, 
	petPhoto: {
		type: String,
		default: "Edit Pet to Update!"
	} 
})

module.exports = mongoose.model('Pet', petSchema)