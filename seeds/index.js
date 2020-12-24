const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }); 


// Error checking for mongoDB connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected!');
})

// import the Campground model
const Campground = require('../models/campground'),
      { jsonCities } = require('./worldCities'),
      { descriptors, places } = require('./seedHelpers');

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i=0; i<1000; i++) {
        const randomIndex = Math.floor(Math.random() * jsonCities.length);
        const randomPrice = Math.floor(Math.random() * 30) + 20;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            author: '5fd9dfa0bf96232b2c5dc8c0',
            "geometry" : {
              "type" : "Point",
              "coordinates" : [  
                  jsonCities[randomIndex].lng,
                  jsonCities[randomIndex].lat
              ]
            },
            images: [
              {
                "url" : "https://res.cloudinary.com/oakhtar147/image/upload/v1608404038/YelpCamp/lku7hwhilqbv7p4pyuos.jpg",
                "filename" : "YelpCamp/lku7hwhilqbv7p4pyuos"
              },
              {
                "url" : "https://res.cloudinary.com/oakhtar147/image/upload/v1608404038/YelpCamp/pqcqqb5tqkamsq6zurzf.jpg",
                "filename" : "YelpCamp/pqcqqb5tqkamsq6zurzf"
              }
            ],
            price: randomPrice,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, voluptatem temporibus aliquid pariatur totam obcaecati cupiditate culpa veniam dolorem, ex beatae asperiores impedit nostrum in eveniet illo eligendi sed molestias.',
            location: `${jsonCities[randomIndex].city}, ${jsonCities[randomIndex].country}` 
          })
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
    console.log("Seeding done!");
}).catch((error) => console.log(error));