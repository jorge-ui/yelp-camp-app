var mongoose   = require("mongoose");
//Mongoose schema and model setup
var commentSchema = mongoose.Schema({
   text: String,
   author: {
      _id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
      },
      username: String
   }
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;//file return