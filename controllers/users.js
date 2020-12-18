const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
};

module.exports.registerUser = async (req, res, next) => {
    const { username, email, password } = req.body.user;
    const user = new User({ email: email, username: username })
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => { if(err) next(err); });
    req.flash('success', 'You have successfully registered');
    res.redirect('/campgrounds');   
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.loginUser = (req, res) => {
    const { username } = req.body.username;
    const { redirectUrl = '/campgrounds' } = req.session;
    delete req.session.redirectUrl;
    req.flash('success', `Logged in as ${username}`)
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'We hope to see you again soon!')
    res.redirect('/campgrounds');
};