const app = require('./server');

const port = process.env.PORT || 2560;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
