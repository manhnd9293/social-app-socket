const {SocketEvent} = require("../../utils/constant");
const {getNotiUserRoom} = require("../../utils/utils");
const utils = require("../../utils/utils");

module.exports = (io, socket, userId) => {
  socket.on(SocketEvent.FriendRequest, async (data) => {
    try {
      socket.to(getNotiUserRoom(data.to)).emit(SocketEvent.FriendRequest, data);
    } catch (e) {
      console.log({
        status: 'Bad Request',
        error: e.message
      })
    }
  })

  socket.on(SocketEvent.AcceptRequest, (conversation) => {
    socket.join(utils.getConversationRoom(conversation._id));

    const otherId = conversation.participants.find(id => id !== userId);
    socket.to(utils.getNotiUserRoom(otherId)).emit(SocketEvent.NewConversation, conversation);
  })
}