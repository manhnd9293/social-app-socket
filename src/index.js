require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);
const {Server: IoServer} = require('socket.io');
const {connectDb} = require("./config/db/mongo");
const registerUserHandlers = require('./services/user/UserHandler');

const io = new IoServer(server, {
  cors: {
    origin: process.env.CLIENT_URL
  }
});


io.on('connection', (socket) => {
  registerUserHandlers(io, socket);



  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
})

async function startServer() {
  try{
    await connectDb();
    const port = process.env.PORT || 6000;
    server.listen(port, () => {
      console.log(`Socket server is running on port ${port}`)
    });

  } catch (e) {
    console.log(`Fail to start socket server, ${e.toString()}`);
  }
}

startServer();


