const {SocketEvent} = require("../../utils/constant");
const {UserService} = require("./UserService");

module.exports = (io, socket) => {
  socket.on(SocketEvent.JoinRoom, (data) => {
    const {_id: userId} = {...data};
    socket.join([userId]);
  })

  socket.on(SocketEvent.FriendRequest, async (data) => {
    try {
      const request = await UserService.createFriendRequest(data);
      socket.to(data.to).emit(SocketEvent.FriendRequest, request);
    } catch (e) {
      console.log({
        status: 'Bad Request',
        error: e.message
      })
    }
  })
}