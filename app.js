if(process.env.NODE_ENV !== "production") { require('dotenv').config(); };

const path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    ejsMate = require('ejs-mate'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    flash = require('connect-flash'),   
    LocalStrategy = require('passport-local').Strategy,
    methodOverride = require('method-override'),
    helmet = require('helmet'),
    mongoSanitize = require('express-mongo-sanitize'),
    MongoStore = require('connect-mongo')(session);
    ExpressError = require('./utils/ExpressError');
    userRoutes = require('./routes/users'),
    reviewRoutes = require('./routes/reviews'),
    campgroundRoutes = require('./routes/campgrounds'),
    User = require('./models/user');
 

const dbUrl = process.env.MONGO_ATLAS_URL || 'mongodb://localhost/yelp-camp';
const secret = process.env.SECRET || 'oakhtar';
      
const app = express();
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const sessionConfig = {
    store: new MongoStore({ 
        url: dbUrl,
        touchAfter: 24 * 60 * 60 
    }),
    secret,
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
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    next();
})
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use(userRoutes);


app.use(mongoSanitize({
    replaceWith: '_'
}))
app.use(helmet({ contentSecurityPolicy: false }));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }); 

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected!');
});


app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    throw new ExpressError('Page Not Found', 404);
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 400).render('error', { err });
});;

app.listen(PORT=(process.env.PORT || 3000), () => {
    console.log(`Serving on port ${PORT}`);
});