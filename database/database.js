const Sequelize = require('sequelize');
require('dotenv').config();

const db = process.env.NODE_ENV === 'test' ? `${process.env.DB_TEST_DATABASE}` : `${process.env.DB_DATABASE}`;
const user = process.env.NODE_ENV === 'test' ? `${process.env.DB_TEST_USER}` : `${process.env.DB_USER}`;
const pass = process.env.NODE_ENV === 'test' ? `${process.env.DB_TEST_PASS}` : `${process.env.DB_PASS}`;
const host = process.env.NODE_ENV === 'test' ? `${process.env.DB_TEST_HOST}` : `${process.env.DB_HOST}`;

console.log('process.env.NODE_ENV is', process.env.NODE_ENV);

const orm = new Sequelize(
  db,
  user,
  pass,
  {
    logging: false,
    host,
    dialect: 'postgres',
  },
);

orm
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

/* MODELS (alphabetized) */

const Chef = orm.define('chef', {
  email: Sequelize.STRING,
  name: Sequelize.STRING,
  password: Sequelize.STRING,
  username: Sequelize.STRING,
  createdAt: {
    type: 'TIMESTAMP',
    allowNull: false,
  },
  updatedAt: {
    type: 'TIMESTAMP',
    allowNull: false,
  },
});


const User = orm.define('user', {
  email: Sequelize.STRING,
  name: Sequelize.STRING,
  password: Sequelize.STRING,
  username: Sequelize.STRING,
  createdAt: {
    type: 'TIMESTAMP',
    allowNull: false,
  },
  updatedAt: {
    type: 'TIMESTAMP',
    allowNull: false,
  },
});

orm.sync();

exports.connection = orm;
exports.Chef = Chef;
exports.User = User;
