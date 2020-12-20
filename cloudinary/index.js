const cloudinary = require('cloudinary').v2,
      { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'YelpCamp',
      allowed_formats: ['png', 'jpg', 'jpeg'],
    },
});


module.exports = {
    cloudinary,
    cloudinaryStorage
}