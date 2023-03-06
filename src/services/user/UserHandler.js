const {SocketEvent} = require("../../utils/constant");
module.exports = (io, socket) => {
  socket.on(SocketEvent.JoinRoom, (data) => {
    const {_id: userId} = {...data};
    socket.join([userId]);
  })

  socket.on(SocketEvent.FriendRequest, data => {
    socket.to(data.to).emit(SocketEvent.FriendRequest, data);
  })
}