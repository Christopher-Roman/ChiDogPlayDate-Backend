const mongoose = require('mongoose');
const Comment = require('./comment');

const postSchema = new mongoose.Schema({
	postBody: {
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
	comment: [Comment.schema]
})

module.exports = mongoose.model('Post', postSchema);