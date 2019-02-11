var mongoose   = require("mongoose");
//Mongoose schema and model setup
var campSchema = mongoose.Schema({
   name: String,
   image: String,
   description: {type: String, default: ""},
   comments: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
        }],
   author:{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
            },
        username: String
        }
});

var Campground = mongoose.model('Campground', campSchema);

module.exports = Campground;//file return