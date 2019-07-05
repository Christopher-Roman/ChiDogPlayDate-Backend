const mongoose = require('mongoose');
const Comment = require('./comment');

const photoSchema = new mongoose.Schema({
	photoUrl: {
		type: String,
		required: true
	},
	createdBy: String,
	description: String,
	createdAt: {
		type: Date,
		default: Date.now
	},
	comment: [Comment.schema]
})

module.exports = mongoose.model('Photo', photoSchema);