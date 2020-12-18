const express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      users = require('../controllers/users'),
      catchAsync = require('express-async-handler'),
      passport = require('passport');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), users.loginUser);

router.get('/logout', users.logoutUser);


module.exports = router;