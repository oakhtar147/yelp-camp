const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('express-async-handler');
const passport = require('passport');


router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body.user;
        const user = new User({ email: email, username: username })
        const registeredUser = await User.register(user, password);
        req.flash('success', 'You have successfully registered');
        res.redirect('/campgrounds'); 
    } catch(err) {
        req.flash('error', 'Username or email already in use.')
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/register', failureFlash: true }), (req, res) => {
    const { username } = req.body.username;
    req.flash('success', `Logged in as ${username}`)
    res.redirect('/campgrounds');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'We hope to see you again soon!')
    res.redirect('/campgrounds');
})

module.exports = router;