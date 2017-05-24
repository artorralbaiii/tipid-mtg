let mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    condition: String,
    description: String,
    details: String,
    postType: String,
    price: Number,
    user: { type: mongoose.Schema.Types.ObjectId, fef: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);


