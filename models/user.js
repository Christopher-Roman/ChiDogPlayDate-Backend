const mongoose = require('mongoose');
const Pet = require('./pet');
const Post = require('./post');
const Photo = require('./photo');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		require: true,
		unique: true
	},
	password: {
		type: String,
		require: true
	},
	creationDate: {
		type: Date,
		default: Date.now
	},
	emailAddress: String,
	bio: String,
	userPhoto: String,
	address: String,
	pet: [Pet.schema],
	post: [Post.schema],
	petPhoto: [Photo.schema]
})

module.exports = mongoose.model('User', userSchema);