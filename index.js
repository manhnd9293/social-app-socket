require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);
const {Server: IoServer} = require('socket.io');
const {SocketEvent} = require("./utils/constant");
const io = new IoServer(server, {
  cors: {
    origin: process.env.CLIENT_URL
  }
});


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on(SocketEvent.JoinRoom, (data) => {

    const {_id: userId} = {...data};
    socket.join([userId]);
  })

  socket.on(SocketEvent.FriendRequest, data => {
    socket.to(data.to).emit(SocketEvent.FriendRequest, data);

  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
} )

const port = process.env.PORT || 6000;
server.listen(port, () => {
  console.log(`Socket server is running on port ${port}`)
})
