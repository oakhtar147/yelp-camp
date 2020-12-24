const ExpressError = require('../utils/ExpressError');

const Campground = require('../models/campground'),
      { cloudinary } = require('../cloudinary'),
      mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'),
      geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_PUBLIC_TOKEN });


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    const { campground } = req.body;
    const geoData = await geocodingClient.forwardGeocode({
        query: campground.location,
        limit: 1
    }).send();
    try {
        const { geometry } = geoData.body.features[0];
        const newCampground =  new Campground(campground);
        newCampground.geometry = geometry;
        newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
        newCampground.author = req.user._id;
        await newCampground.save();
        req.flash('success', 'Successfully created the campground!');
        res.redirect(`/campgrounds/${newCampground._id}`);
    } catch (err) {
        throw new ExpressError('Please provide a proper location for the campground.', 400);
    }
};

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
                                    .populate({
                                        path: 'reviews', 
                                        populate: {
                                            path: 'author'
                                        }
                                        })
                                    .populate('author'); 
    res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
};

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const { imagesToDelete = [] } = req.body;
    const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground });
    if(imagesToDelete.length > 0) {
        await campground.updateOne({$pull: { images:  {filename: { $in: imagesToDelete } }}});
        for(let filename of imagesToDelete) {
            cloudinary.uploader.destroy(filename);
        }
    }
    campground.images.push(...newImages);   
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.destroyCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
};