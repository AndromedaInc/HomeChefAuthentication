/* **** Express modules **** */
const express = require('express');

const app = express();
const morgan = require('morgan');

/* **** JWT and Authentication Modules **** */
const cookieParser = require('cookie-parser');

/* **** Server-side Rendering Modules **** */
const bodyParser = require('body-parser');

/* **** DB Connection modules **** */
const auth = require('./auth');

/* **** Apply universal middleware **** */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan({ format: 'dev' }));

/* **** Authentication **** */
app.post('/api/chef/signup', auth.chefSignup);
app.post('/api/chef/login', auth.chefLogin);
app.post('/api/user/login', auth.userLogin);
app.post('/api/user/signup', auth.userSignup);

module.exports = app;
