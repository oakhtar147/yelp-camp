const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('express-async-handler');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { validateReview } = require('../validations/validation_functions');


router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await Promise.all([review.save(), campground.save()]);
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:reviewID', catchAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await Review.findByIdAndDelete(reviewID);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;