const Joi = require('Joi');

module.exports.validateCampgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi
                .string()
                .required(),
        price: Joi
                .number()
                .min(0)
                .required(),
        image: Joi
                .string()
                .uri()
                .required(),
        location: Joi
                .string()
                .required(),
        description: Joi
                .string()
                .allow('')
    }).required()
})  

module.exports.validateReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required()
    }).required()
})