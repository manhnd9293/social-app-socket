const {SocketEvent} = require("../../utils/constant");
const {ConversationService} = require("./ConversationService");
const utils = require("../../utils/utils");

module.exports = (io, socket, userId) => {
  socket.on(SocketEvent.MessageSent, async ({conversationId, from, textContent}) => {
    try {
      const newMessage = await ConversationService.handleNewMessage({conversationId, from, textContent});
      socket.to(utils.getConversationRoom(conversationId)).emit(SocketEvent.MessageReceived, newMessage)
    } catch (e) {
      socket.emit(SocketEvent.SentMessageFail, {
        message: e.message,
        data: {
          conversationId,
          textContent
        }
      })
    }
  });

  socket.on(SocketEvent.NewConversation, (conversation) => {
    socket.join(utils.getConversationRoom(conversation._id));
  });

  socket.on(SocketEvent.Typing, (data) => {
    socket.to(utils.getConversationRoom(data.conversationId)).emit(SocketEvent.Typing, data);
  })

  socket.on(SocketEvent.EndTyping, (data) => {
    socket.to(utils.getConversationRoom(data.conversationId)).emit(SocketEvent.EndTyping, data);
  })

}