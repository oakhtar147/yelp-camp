const { validateCampgroundSchema, validateReviewSchema } = require('./validation_schemas');
const ExpressError = require('../utils/ExpressError');


module.exports.validateCampground = (req, res, next) => {
    const { error } = validateCampgroundSchema.validate(req.body);
    // console.log(error);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    } else {
        next();
    }
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
