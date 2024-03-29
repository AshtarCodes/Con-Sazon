const flash = require("express-flash");
const express = require("express");

const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/database");
const homeRoutes = require("./routes/home");
const recipeRoutes = require("./routes/recipe");
const authRoutes = require("./routes/auth");
const formatMessages = require("./middleware/customFunctions").formatMessages;

// Load env variables into app
dotenv.config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

// express middleware
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// use forms for put & delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    // cannot enable cookie.secure, until this app has an ssl certificate
    cookie: { maxAge: 3600000 },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// use express-flash to display errors and success messages
app.use(flash());
app.use((req, res, next) => {
  const successMsg = formatMessages(req.flash("success"));
  const errorMsg = formatMessages(req.flash("errors"));
  console.log("succes: ", successMsg);
  console.log("error: ", errorMsg);
  res.locals.success = successMsg;
  res.locals.errors = errorMsg;
  next();
});

// routes
app.use("/dashboard", homeRoutes);
app.use("/recipes", recipeRoutes);
app.use("/", authRoutes);

const PORT = process.env.PORT || 3001;

// connect to database
connectDB().then(() => {
  app.listen(PORT, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Server running on port ${PORT}`);
    }
  });
});
