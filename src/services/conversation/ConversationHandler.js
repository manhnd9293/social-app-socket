const {SocketEvent} = require("../../utils/constant");
const {ConversationService} = require("./ConversationService");
const utils = require("../../utils/utils");

module.exports = (io, socket) => {
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
  })
}