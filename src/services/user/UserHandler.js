const {SocketEvent} = require("../../utils/constant");
const {UserService} = require("./UserService");

module.exports = (io, socket, userId) => {
  socket.on(SocketEvent.JoinRoom, async (data) => {
    const {_id: userId} = {...data};
    const rooms = await UserService.getRoomsForUser(userId);
    socket.join(rooms);
  });
}