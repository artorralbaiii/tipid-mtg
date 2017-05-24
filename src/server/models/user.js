'use strict';

let bcrypt = require('bcrypt-nodejs');
let mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    contact: String,
    email: String,
    fullName: String,
    location: String,
    password: { type: String, required: true, select: false },
    registeredDate: { type: Date, default: Date.now },
    username: { type: String, required: true, index: { unique: true } },
}, { timestamps: true });

userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) { return next(); }

    bcrypt.hash(user.password, null, null, (err, hash) => {
        if (err) { return next(err); }
        user.password = hash;
        next();
    });

});

userSchema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', userSchema);