const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const path = require('path');

app.use(cors());
// creating a path for the build folder to be located outside of the backend folder
// ensure the build folder is loaded first
app.use(express.static(path.join('build')));

app.use(express.static('public'));
// 1. Inform express.js to serve all the files from public folder
// 2. It is possible to have multiple express.static methods for
// serving different folder content

app.use((req, res, next) => {
  res.sendFile(path.join('build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Listening to Port ${port}`);
});
