const {SocketEvent, OnlineState} = require("../../utils/constant");
const {UserService} = require("./UserService");

module.exports = (io, socket, userId) => {
  socket.on(SocketEvent.JoinRoom, async () => {
    await UserService.updateOnlineStatus(userId, socket, OnlineState.Online);
    const rooms = await UserService.getRoomsForUser(userId);
    socket.join(rooms);
  });

  socket.on(SocketEvent.Disconnect, async () => {
    console.log('userhandler: user disconnect')
    await UserService.updateOnlineStatus(userId, socket, OnlineState.Offline)
  });
}