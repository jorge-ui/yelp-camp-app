var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// AUTHENTICAION
//=============================================

    // HOME - landing page
    router.get('/', (req, res) => {
        res.render('landing');
    });

    // Register form
    router.get('/register', (req, res) => {
        res.render('register');
    });

    // Register post
    router.post('/register', (req, res) => {
        User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
            if(err) {
                console.log(err);
                req.flash('error', err.message);
                res.redirect('/register');
            } else {
                passport.authenticate('local')(req, res, () => {
                    req.flash('success', "Welcome to YelpCamp " + user.username);
                    res.redirect('/campgrounds');
                });
            }
        });
    });

    // Login form
    router.get('/login', (req, res) => {
        res.render('login');
    });

    // Login post
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
        failureFlash: 'Incorrect username or password',
        successFlash: 'Welcome!'
    }));

    // Logout
    router.get('/logout', (req, res) => {
        req.logOut();
        req.flash('success', 'Succesfully logged out!');
        res.redirect('/campgrounds');
    });

module.exports = router;