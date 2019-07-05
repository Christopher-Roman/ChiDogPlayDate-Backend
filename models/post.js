const mongoose = require('mongoose');
const Comment = require('./comment');

const postSchema = new mongoose.Schema({
	postTitle: {
		type: String,
		required: true
	},
	postBody: {
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
	comment: [Comment.schema]
})

module.exports = mongoose.model('Post', postSchema);