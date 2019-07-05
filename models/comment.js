const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	commentBody: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	createdBy: {
		type: String,
		required: true
	},
	photo: String
})

module.exports = mongoose.model('Comment', commentSchema)