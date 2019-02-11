var mongoose = require("mongoose");
passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
// add 'passport-local-mongoose' package mothods to UserSchema
UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', UserSchema);

module.exports = User;