require('dotenv').config();
const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);

const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const fs = require('fs');

const chefs = require('./../database/chefs.js');
const users = require('./../database/users.js');

/* ********* AUTHENTICATION USING JWT ********* */

const RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY || fs.readFileSync(`${__dirname}/../config/private.key`);
const RSA_PUBLIC_KEY = process.env.RSA_PUBLIC_KEY || fs.readFileSync(`${__dirname}/../config/public.key`);

// Generate token to be placed in cookie
const createJWTBearerToken = user => jwt.sign({}, RSA_PRIVATE_KEY, {
  algorithm: 'RS256',
  expiresIn: 600000, // 10 min is 600000
  subject: user.id.toString(), // TODO: might want to change this to username now that set up as a microservice
});

// Protect routes
const checkIfAuthenticated = expressJwt({
  secret: RSA_PUBLIC_KEY,
  // comment out following line if sending Postman requests as cookie is retrieved differently
  getToken: req => req.cookies.SESSIONID,
}).unless({ path: ['/', '/chefauth', '/userauth'] });

/* ********** LOGIN ********** */
const userLogin = (req, res) => {
  const { username, password } = req.body;

  let user;
  if (!username || !password) {
    return res.status(401).send('incomplete fields');
  }
  return users
    .checkUsername(username)

    .then((userRecord) => {
      if (!userRecord) {
        return res.status(400).send('user not found');
      }
      user = userRecord;
      const {
        dataValues: { password: hash },
      } = user;
      return bcrypt.compare(password, hash);
    })

    .then((match) => {
      if (match) {
        return createJWTBearerToken(user);
      }
      throw new Error({ message: 'that password does not match' });
    })

    .then((token) => {
      const {
        dataValues: { id: authId },
      } = user;
      return res.status(200).send({ authId, token });
    })

    .catch(err => res.status(401).send(err));
};

const chefLogin = (req, res) => {
  const { username, password } = req.body;

  let chef;
  if (!username || !password) {
    return res.status(401).send('incomplete fields');
  }
  return chefs
    .checkUsername(username)

    .then((chefRecord) => {
      if (!chefRecord) {
        return res.status(400).send('user not found');
      }
      chef = chefRecord;
      const {
        dataValues: { password: hash },
      } = chef;
      return bcrypt.compare(password, hash);
    })

    .then((match) => {
      if (match) {
        return createJWTBearerToken(chef);
      }
      throw new Error({ message: 'that password does not match' });
    })

    .then((token) => {
      const {
        dataValues: { id: authId },
      } = chef;
      return res.status(200).send({ authId, token });
    })

    .catch(err => res.status(401).send(err));
};

/* ********** SIGNUP ********** */
const userSignup = (req, res) => {
  const {
    username, password, email, name,
  } = req.body;

  let user;
  if (!username || !password || !email || !name) {
    return res.status(401).send('incomplete fields');
  }

  return users
    .checkExistingEmailUsername(username, password)

    .then((result) => {
      if (result) {
        return res.status(400).send('that username or email already exists');
      }
      return bcrypt.hash(password, salt);
    })

    .then(hash => users.createUser(username, hash, email, name))

    .then((record) => {
      user = record;
      return createJWTBearerToken(user);
    })

    .then((token) => {
      const { dataValues: { id: authId } } = user;
      return res.status(200).send({ authId, token });
    })

    .catch(err => res.status(401).send(err));
};

const chefSignup = (req, res) => {
  const {
    username, password, email, name,
  } = req.body;

  let chef;
  if (!username || !password || !email || !name) {
    return res.status(401).send('incomplete fields');
  }

  return chefs
    .checkExistingEmailUsername(username, password)

    .then((result) => {
      if (result) {
        return res.status(400).send('that username or email already exists');
      }
      return bcrypt.hash(password, salt);
    })

    .then(hash => chefs.createChef(username, hash, email, name))

    .then((record) => {
      chef = record;
      return createJWTBearerToken(chef);
    })

    .then((token) => {
      const { dataValues: { id: authId } } = chef;
      return res.status(200).send({ authId, token });
    })

    .catch(err => res.status(401).send(err));
};

exports.chefLogin = chefLogin;
exports.userLogin = userLogin;
exports.chefSignup = chefSignup;
exports.userSignup = userSignup;
exports.checkIfAuthenticated = checkIfAuthenticated;
