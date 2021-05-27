const flash = require('express-flash')
const express = require('express')
const mongoose = require("mongoose");
const passport = require('passport')
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const dotenv = require('dotenv')
const app = express()
const connectDB = require("./config/database");
const morgan = require('morgan')
const homeRoutes = require('./routes/home')
const recipeRoutes = require('./routes/recipe')


// Load env variables into app
dotenv.config({path: './config/.env'})

// Passport config
require("./config/passport")(passport);

// connect to database
connectDB()

// express middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Logging
if(process.env.NODE_ENV = 'development'){
    app.use(morgan('dev'))
}

// Setup Sessions - stored in MongoDB
app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// use express-flash to display errors and information
app.use(flash())

// routes
app.use('/', homeRoutes)
app.use('/recipes', recipeRoutes)


const PORT = process.env.PORT || 3000; 

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))