const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const port = process.env.PORT || 5000;

const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const nameList = new Set([]);

app.use(cors());
// creating a path for the build folder to be located outside of the backend folder
// ensure the build folder is loaded first
app.use(express.static(path.join(__dirname, '.', 'build')));
// // 1. Inform express.js to serve all the files from public folder
// // 2. It is possible to have multiple express.static methods for
// // serving different folder content
app.use(express.static('public'));
// for client side routing
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

io.on('connection', (socket) => {
  console.log(`client connected: ${socket.id}`);

  socket.on('newUser', (newUserName) => {
    console.log('newUser');
    console.log(newUserName);
    console.log(!nameList.has(newUserName));
    if (nameList.has(newUserName) === false) {
      console.log('passed');

      socket.emit('newUser', newUserName);
    } else {
      socket.emit('newUser', '');
    }
  });

  socket.on('newMsg', (newMsg) => {
    console.log('newMsg');
    console.log(newMsg);
    console.log('#### broadcasting ####');
    io.emit('newMsg', newMsg);
  });

  socket.on('disconnect', () => {
    console.log(`client disconnected: ${socket.id}`);
  });
});

server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening to Port ${port}`);
  }
});
// app.listen(port, () => {
//   console.log(`Listening to Port ${port}`);
// });
