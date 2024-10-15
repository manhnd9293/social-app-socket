const ConversationModel = require("./ConversationModel");
const MessageModel = require("../message/MessageModel");
const {ObjectId} = require('mongoose').Types;

class ConversationService {

  async handleNewMessage({from, textContent, conversationId}) {
    const con = await ConversationModel.findOne({_id: conversationId});

    if(!con) {
      throw Error('Conversation not exist');
    }

    if(!con.participants.map(id => id.toString()).includes(from)){
      throw Error('User not in this conversation');
    }

    const newMessage = await MessageModel.create({
      conversationId,
      from,
      textContent
    });

    await ConversationModel.updateOne({
      _id: conversationId
    }, {
      $set: {
        lastMessageId: newMessage._id
      }
    })

    return await MessageModel.populate(newMessage, {path: 'from', select: {fullName: 1, avatar: 1}});
  }

  async updateSeenMessage({conversationId, messageId, userId}) {
    const message = await MessageModel.findOne({
      _id: messageId
    });
    if (!message) {
      console.log(`Message not found - id ${messageId}`);
      return;
    }

    if (message.conversationId._id.toString() !== conversationId) {
      console.log('Some messages are not in this conversation');
    }

    const conversation = await ConversationModel.findOne({
      _id: conversationId
    }).lean();

    if (!conversation) {
      console.log(`Conversation does not exist - id ${conversationId}`);
      return;
    }

    if (!conversation.participants.map(id => id.toString()).includes(userId)) {
      console.log(`Current user does not in this conversation`);
      return;
    }

    await MessageModel.updateOne({
      _id: messageId,
      from: {$ne: userId}
    }, {
      $push: {
        seen: new ObjectId(userId)
      }
    });
  }

}

module.exports = {ConversationService: new ConversationService()}
