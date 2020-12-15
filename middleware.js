module.exports.loginRequired = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('You must be logged in for this.')
        return res.redirect('/login');
    } next();
}

