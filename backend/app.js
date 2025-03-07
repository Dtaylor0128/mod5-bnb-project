//--Imports--
const express = require('express');
require('express-async-errors');
const routes = require('./routes');

// const spotsRouter = require('./routes/spots');
// // ?

// --Security Imports--
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');

//--Utility Imports--
const cookieParser = require('cookie-parser');
const { environment } = require('./config');
const { ValidationError } = require('sequelize');
const sequelize = require('./config/database'); // Import the database configuration

const isProduction = environment === 'production';

// --Express--
const app = express();

// --Middlewares--
app.use(morgan('dev')); // security
app.use(cookieParser()); // parse cookies from headers
app.use(express.json()); // allows use of json in req/res

// --Security Middleware--
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}
// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);
// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

//----------------Middle ware must be used above this line-------
// --Routes--
app.use(routes); // Connect all the routes

// -----ERROR HANDLING----

// Catch unhandled requests and forward to error handler.
app.use((req, res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    // title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    // stack: isProduction ? null : err.stack
  });
});

module.exports = app;
