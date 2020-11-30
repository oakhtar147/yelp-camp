const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }); 


// Error checking for mongoDB connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected!');
})

// import the Campground model
const Campground = require('../models/campground');
const {descriptors, places} = require('./seedHelpers');
const cities = require('./cities');

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i=0; i<50; i++) {
        const randomIndex = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 30) + 20;
        const camp = new Campground({ title: `${sample(descriptors)} ${sample(places)}`,
                                      image: 'https://source.unsplash.com/collection/429524/',
                                      price: randomPrice,
                                      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde, voluptatem temporibus aliquid pariatur totam obcaecati cupiditate culpa veniam dolorem, ex beatae asperiores impedit nostrum in eveniet illo eligendi sed molestias.',
                                      location: `${cities[randomIndex]['city']}, ${cities[randomIndex]['state']}` 
                                    })
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
    console.log("Seeding done!");
}).catch((error) => console.log(error));
