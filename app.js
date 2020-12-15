// Installing misc modules and dependencies
const path = require('path');
const flash = require('flash');
const express = require('express');
const ejsMate = require('ejs-mate');
const bodyParser = require('body-parser');
const session = require('express-session'); 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const campgroundRoutes = require('./routes/campgrounds');
const User = require('./models/user');

const app = express();
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const sessionConfig = {
    secret: 'oakhtar',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge : 1000 * 60 * 60 * 24 * 7 // a week
    }    
}    

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    next();
})
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use(userRoutes);

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const mongoose = require('mongoose');
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