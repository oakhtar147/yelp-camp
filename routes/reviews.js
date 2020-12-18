const express = require('express'),
      router = express.Router({ mergeParams: true }),
      catchAsync = require('express-async-handler'),
      reviews = require('../controllers/reviews'),
      { validateReview, loginRequired, isReviewAuthor } = require('../middleware');


router.post('/', loginRequired, validateReview, catchAsync(reviews.addReview));

router.delete('/:reviewId', loginRequired, isReviewAuthor, catchAsync(reviews.destroyReview))


module.exports = router;