const { validateCampgroundSchema, validateReviewSchema } = require('./validations/validation_schemas'),
      ExpressError = require('./utils/ExpressError'),
      Campground = require('./models/campground'),
      Review = require('./models/review');


module.exports.loginRequired = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('You must be logged in for this.');
        return res.redirect('/login');
    } next();
}

module.exports.isCampgroundAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id); 
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to make changes');
        return res.redirect(`/campgrounds/${campground._id}`);
    } else 
        next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to delete this review!');
        return res.redirect(`/campgrounds/${id}`);
    } else 
        next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = validateCampgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    } else
        next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = validateReviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    } else {
        next();
    } 
}