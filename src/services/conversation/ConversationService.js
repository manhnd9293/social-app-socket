const ConversationModel = require("./ConversationModel");
const MessageModel = require("../message/MessageModel");

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
}

module.exports = {ConversationService: new ConversationService()}
