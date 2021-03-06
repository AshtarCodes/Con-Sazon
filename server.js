const flash = require('express-flash');
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/database');
const homeRoutes = require('./routes/home');
const recipeRoutes = require('./routes/recipe');
const authRoutes = require('./routes/auth');

// Load env variables into app
dotenv.config({ path: './config/.env' });

// Passport config
require('./config/passport')(passport);

// connect to database
connectDB();

// express middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// use forms for put & delete
app.use(methodOverride('_method'));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// use express-flash to display errors and success messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.errors = req.flash('errors');
  next();
});

// routes
app.use('/', authRoutes);
app.use('/dashboard', homeRoutes);
app.use('/recipes', recipeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running`));
