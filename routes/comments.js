var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var Validate = require('../middleware/index');

// COMMENTS
//=============================================

    // NEW
    router.get('/new', Validate.isLoggedIn, (req, res) => {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err) {
                console.log(err);
            } else {
                res.render('comments/new', {campground: foundCampground}); 
            }
        });
    });

    // CREATE
    router.post('/', Validate.isLoggedIn, (req, res) => {
        Comment.create(req.body.comment, (err, newComment) => {
            if(err) {
                console.log(err);
            } else {
                Campground.findById(req.params.id, (err, foundCampground) => {
                    if(err) {
                        console.log(err);
                    } else {
                        newComment.author._id = req.user._id;
                        newComment.author.username = req.user.username;
                        newComment.save();
                        foundCampground.comments.push(newComment);
                        foundCampground.save();
                        res.redirect('/campgrounds/' + req.params.id);
                    }
                });
            }
        });
    });

    // EDIT
    router.get('/:comment_id/edit', Validate.ownsComment, (req, res) => {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                console.log(err);
            } else {
                res.render('comments/edit', {comment: foundComment, campground_id: req.params.id});
            }
        });
    });
    // UPDATE
    router.put('/:comment_id', Validate.ownsComment, (req, res) => {
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
            if(err) {
                console.log(err);
            } else {
                res.redirect('/campgrounds/' + req.params.id);
            }
        });
    });
    // DELETE
    router.delete('/:comment_id', Validate.ownsComment, (req, res) => {
        Comment.findByIdAndDelete(req.params.comment_id, (err) => {
            if(err) {
                console.log(err);
            } else {
                //Also delete commentID form campground assosiation
                Campground.findById(req.params.id, (err, foundCampground) => {
                    for( var i = 0; i < foundCampground.comments.length; i++){ 
                        if (foundCampground.comments[i].equals(req.params.comment_id)) {
                            foundCampground.comments.splice(i, 1);
                            break;
                        }
                     }
                    foundCampground.save();
                    res.redirect('/campgrounds/' + req.params.id);
                });
            }
        });
    });

module.exports = router;