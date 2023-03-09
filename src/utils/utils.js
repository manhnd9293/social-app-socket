const utils = {
  getNotiUserRoom: (id) => `user:${id}`,
  getConversationRoom: (conId) => `conversation:${conId}`
}

module.exports = utils;