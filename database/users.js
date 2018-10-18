const db = require('./database.js');

const checkExistingEmailUsername = (username, email) => {
  const { or } = db.connection.Op;
  return db.User.findOne({
    where: {
      [or]: [{ username }, { email }],
    },
  });
};

const checkUsername = username => db.User.findOne({ where: { username } });

const createUser = (username, password, email, name) => db.User.create({
  username,
  password,
  email,
  name,
});

exports.checkExistingEmailUsername = checkExistingEmailUsername;
exports.checkUsername = checkUsername;
exports.createUser = createUser;