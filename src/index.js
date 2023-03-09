require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);
const {Server: IoServer} = require('socket.io');
const {connectDb} = require("./config/db/mongo");
const registerUserHandlers = require('./services/user/UserHandler');
const conversationHandler = require('./services/conversation/ConversationHandler');
const {UserService} = require("./services/user/UserService");
const io = new IoServer(server, {
  cors: {
    origin: process.env.CLIENT_URL
  }
});


io.on('connection', (socket) => {
  console.log('an user connection')
  const timeout = setTimeout(() => {
    console.log(`disconnect socket ${socket.id}`)
    socket.disconnect();
  }, 5000);

  socket.on('auth', async data => {
    try{
      clearTimeout(timeout);
      const user = await UserService.verifyToken(data);

      registerUserHandlers(io, socket);
      conversationHandler(io, socket);

      socket.emit('auth-success', 'success');

    } catch (e) {
      console.log({e})
      socket.emit('error', e.message);
      socket.disconnect();
    }
  })

  socket.on('disconnect', () => {
    console.log(`user disconnected ${socket.id}`);
  });
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


