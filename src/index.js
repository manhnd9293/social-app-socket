require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server: IoServer} = require('socket.io');
const {connectDb} = require("./config/db/mongo");
const registerUserHandlers = require('./services/user/UserHandler');
const registerConversationHandler = require('./services/conversation/ConversationHandler');
const registerRequestHandler = require('./services/request/RequestHandler');
const {UserService} = require("./services/user/UserService");
const utils = require("./utils/utils");
const {verifyToken} = require("./middlewares/verifyToken");
const {SocketEvent} = require("./utils/constant");
const io = new IoServer(server, {
  cors: {
    origin: process.env.CLIENT_URL
  }
});
app.use(express.json());

app.post('/socket-notification', verifyToken, async (req, res, next) => {
  try {
    const {to, from, type, date, payload, unseen} = req.body;
    const room = utils.getNotiUserRoom(to);
    io.to(room).emit(SocketEvent.Notification,{from, type, date, payload, unseen});
    res.status(200).json({data: 'done'});
  } catch (e) {
    next(e)
  }
});

app.post('/socket-friend-request', verifyToken, async (req, res, next) => {
  try {
    const {to, from, date, payload, unseen} = req.body;
    const room = utils.getNotiUserRoom(to);
    io.to(room).emit(SocketEvent.FriendRequest, {from, date, payload, unseen});
    res.status(200).json({data: 'done'});
  } catch (e) {

    next(e)
  }
});

app.use(async (err ,req, res, next) => {
  console.log('fail to process request');
  console.log(err);
  res.status(500).json('Something went wrong');
})


io.on('connection', (socket) => {
  const timeout = setTimeout(() => {
    console.log(`disconnect socket ${socket.id}`)
    socket.disconnect();
  }, 5000);

  socket.on('auth', async data => {
    try{
      clearTimeout(timeout);
      const user = await UserService.verifyToken(data);

      const userId = user.id;
      registerUserHandlers(io, socket, userId);
      registerConversationHandler(io, socket, userId);
      registerRequestHandler(io, socket, userId);

      socket.emit('auth-success', 'success');

    } catch (e) {
      console.log({e})
      socket.emit('error', e.message);
      socket.disconnect();
    }
  })

  socket.on('disconnect', () => {
    console.log(`user disconnected ${socket.id}`);
    socket.removeAllListeners();
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


