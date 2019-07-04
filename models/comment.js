const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	commentBody: {
		type: String,
		require: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	createdBy: {
		type: String,
		require: true
	},
	photo: String
})

module.exports = mongoose.model('Comment', commentSchema)