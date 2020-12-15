const express = require('express');
const catchAsync = require('express-async-handler');
const router = express.Router();
const Campground = require('../models/campground');
const { validateCampground } = require('../validations/validation_functions');
const { loginRequired } = require('../middleware');

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/new', loginRequired, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', loginRequired, validateCampground, catchAsync(async (req, res, next) => {
    const newCampground =  new Campground(req.body.campground);
    await newCampground.save();
    req.flash('success', 'Successfully created the campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground });
})) 

router.get('/:id/edit', loginRequired, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', loginRequired, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground }, { new: true }); // spread the req body object into this new object we are passing as arg
    res.redirect(`/${campground._id}`);
})) 

router.delete('/:id', loginRequired, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))


module.exports = router;