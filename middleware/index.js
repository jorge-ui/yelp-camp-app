var Campground = require('../models/campground');
var Comment = require('../models/comment');
var Validate = {};

// Check if user owns campground
Validate.ownsCampground = function (req, res, next) {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect("back");
    } else {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err) {
                console.log(err);
                req.flash('error', 'Camground does not exist');
                res.redirect("back");
            } else {
                if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                if (foundCampground.author._id.equals(req.user._id)) {
                    next();
                } else  {
                    res.redirect("back"); 
                }
            }
        });
    }
};

// Check if user owns comment
Validate.ownsComment = function (req, res, next) {
    if(!req.isAuthenticated()) {
        res.redirect("back");
    } else {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                console.log(err);
            } else {
                if (!foundComment.author._id.equals(req.user._id)) {
                    res.redirect("back");
                } else  {
                    next();
                }
            }
        });
    }
};

// Check if user is logged in
Validate.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error', 'You need to be logged in to do that.');
        res.redirect('/login');
    }
}

module.exports = Validate;