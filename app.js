// Installing misc modules and dependencies
const path = require('path');
const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const reviewRoutes = require('./routes/reviews');
const campgroundRoutes = require('./routes/campgrounds');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

const mongoose = require('mongoose');
const { urlencoded } = require('express');
mongoose.connect('mongodb://localhost/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }); 

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected!');
})


app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    throw new ExpressError('Page Not Found', 404);
})

app.use((err, req, res, next) => {
    res.status(err.statusCode || 400).render('error', { err });
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})