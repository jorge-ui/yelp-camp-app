var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var Validate = require('../middleware');
// CAMGROUNGS
//=============================================

    // INDEX - view all campground
    router.get('/', (req, res) => {
        //retrieve all campgrounds from database
        Campground.find({}, (err, allCampgrounds) => {
            if(err) {
                console.log(err);
            } else {
                res.render('campgrounds/index', {campgrounds:allCampgrounds});    
            }
        });
    });

    // NEW - form to make new campground
    router.get('/new', Validate.isLoggedIn, (req, res) => {
        res.render('campgrounds/new');
    });

    // CREATE - add new campground to DB
    router.post('/', Validate.isLoggedIn, (req, res) => {
        //create a new campground object
        var name = req.body.name;
        var image = req.body.image;
        var description = req.body.description;
        var author = {
            _id: req.user.id,
            username: req.user.username
        }
        var newCampground = {name: name, image: image, description: description, author: author};
        //add object to database
        Campground.create(newCampground, (err, createdCampground) => {
        if(err) {
            console.log(err);
        } else {
            //redirect back to all campgrounds
            req.flash('success', 'Succesfully added new campground');
            res.redirect('/campgrounds');
        }
        });
    });

    // SHOW - show info about one campground
    router.get('/:id', (req, res) => {
        Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
            if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: foundCampground}); 
        }
        });
    });

    // EDIT
    router.get('/:id/edit', Validate.ownsCampground, (req, res) => {
        Campground.findById(req.params.id, (err, foundCampground) => {
            res.render('campgrounds/edit', {campground: foundCampground});
        });
    });

    // UPDATE
    router.put('/:id', Validate.ownsCampground, (req, res) => {
        Campground.findByIdAndUpdate(req.params.id, req.body.editedCampground, (err, updatedCampground) => {
            if(err) {
                console.log(err);
            } else {
                res.redirect('/campgrounds/' + req.params.id);
            }
        });
    });

    //DELETE
    router.delete('/:id', Validate.ownsCampground, (req, res) => {
        Campground.findById(req.params.id, (err, foundCampground) => {
            foundCampground.comments.forEach((commentID) => {
                Comment.findByIdAndDelete(commentID, (err,res) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('Deleted comment id', commentID);
                    }
                });
            });
        });
        Campground.findByIdAndDelete(req.params.id, (err) => {
            if(err) {
                console.log(err);
                res.send(err);
            } else {
                res.redirect('/campgrounds');
            }
        });
    });
    
module.exports = router;