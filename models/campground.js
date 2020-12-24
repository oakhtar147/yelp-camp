const mongoose = require('mongoose'),
      Review = require('./review'),
      { Schema } = mongoose;

      
const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
    url: String,
    filename: String,
}, opts);

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('upload/', 'upload/w_250/');
})

const CampgroundSchema = new Schema({
    title: String,
    images: [
        ImageSchema
    ],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpHTML').get(function() {
    return `<h6>
                <a href="/campgrounds/${this._id}">
                    <strong>${this.title}</strong>
                </a>
            </h6>
            <p>${this.description.substring(0, 25)}...</p>`
});

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if(doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
});


module.exports = mongoose.model('Campground', CampgroundSchema);