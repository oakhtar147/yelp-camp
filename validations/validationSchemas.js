const BaseJoi = require('Joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
        type: 'string',
        base: joi.string(),
        messages: {
                'string.escapeHTML': '{{#label}} must not include HTML'
        },
        rules: {
                escapeHTML: {
                        validate(value, headers) {
                                const clean = sanitizeHtml(value, {
                                        allowedTags: [],
                                        allowedAttributes: {}
                                });
                                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                                return clean;
                        }
                }
        }
});

const Joi = BaseJoi.extend(extension);

module.exports.validateCampgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi
                .string()
                .required()
                .escapeHTML(),
        price: Joi
                .number()
                .min(0)
                .required(),
        location: Joi
                .string()
                .required()
                .escapeHTML(),
        description: Joi
                .string()
                .allow('')
                .escapeHTML()
    }).required(),
    imagesToDelete: Joi.array()
})  

module.exports.validateReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi
                .number()
                .min(1)
                .max(5)
                .required(),
        body: Joi
                .string()
                .required()
                .escapeHTML()
    }).required()
})