const express = require("express");
const session = require('express-session')
const passport = require('./passport');

const morgan = require('morgan')
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;
require("dotenv").config()

// sign up makes database record (example: username / password). getEntry remembers U+P and encrypts using bcrypt. One way encryption pases a string, which gets encrypted = is this the salt?

// morgan
app.use(morgan('dev'))

// express sessions
app.use(
  session({
  secret: "secret", //pick a random string to make the hash that is generated secure
  resave: false,
  saveUninitialized: false
})
)

app.use((req, res, next) => {
  console.log('req.session', "=============");
  console.log('req.session', req.session);
  return next();
});

// passport
app.use(passport.initialize()) // initializes the passport
app.use(passport.session()) // calls serializeUser and deserializeUser

// app.post('/user', (req, res) => {
//   console.log('user signup');
//   req.session.username = req.body.userName;
//   console.log(req.session.username)
//   res.end()
// })

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// Add routes, both API and view
app.use(routes);

// console.log("Username" , process.env.DBUser)

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/savedLocations`);


// Start the API server
app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
