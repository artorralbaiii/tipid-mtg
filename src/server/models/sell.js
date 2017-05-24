let mongoose = require('mongoose');

var sellSchema = new mongoose.Schema({
    description: String,
    price: Number,
    user: { type: mongoose.Schema.Types.ObjectId, fef: 'User', required: true },
    condition: String,
    details: String
}, { timestamps: true });

module.exports = mongoose.model('Sell', sellSchema);


