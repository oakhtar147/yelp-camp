const express = require('express'),
      catchAsync = require('express-async-handler'),
      router = express.Router({ mergeParams: true }),
      campgrounds = require('../controllers/campgrounds'),
      { cloudinaryStorage } = require('../cloudinary'),
      upload = require('multer')({ storage: cloudinaryStorage }),
      { loginRequired, isCampgroundAuthor, validateCampground } = require('../middleware');
      

router.route('/')
    .get(catchAsync(campgrounds.index))   
    .post(loginRequired, upload.array('campgroundImages'), validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', loginRequired, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(loginRequired, isCampgroundAuthor, upload.array('campgroundImages'), validateCampground, catchAsync(campgrounds.editCampground))
    .delete(loginRequired, isCampgroundAuthor, catchAsync(campgrounds.destroyCampground));

router.get('/:id/edit', loginRequired, catchAsync(campgrounds.renderEditForm));


module.exports = router;