/* This is the start to a testing suite but is not yet functioning */

require('dotenv').config();
const request = require('supertest');

const app = require('./../../server/server');
const db = require('./../../database/database').connection;

process.env.NODE_ENV = 'test';

/* **** PREPARE DATABASE FOR TESTING **** */

beforeAll(async () => {
  await db.sync({ force: true });
});

beforeEach(async () => {
  await db.query("INSERT INTO chefs (name, username, password, email) VALUES ('Mr Chef', 'mrchef12', '$2b$10$dnFm3mDyObGaHvobWwgrT.y9lNSjI1XL8/6BiiYjYgnOZYvIMhS3i', 'mrchef@gmail.com');");
  await db.query("INSERT INTO users (name, username, password, email) VALUES ('Francine', 'franny', 'password', 'franny@gmail.com');");
});

afterEach(async () => {
  await db.query('DELETE FROM users;');
  await db.query('DELETE FROM chefs;');
});

afterAll(async () => {
  await db.close();
});


/* **** TESTING SUITE **** */

// Start with super basic test to ensure the test suite is working
// describe('GET /', () => {
//   test('it should return a 200 status code', async () => {
//     const response = await request(app)
//       .get('/');
//     expect(response.statusCode).toBe(200);
//   });
// });