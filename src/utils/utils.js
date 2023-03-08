const utils = {
  getUserRoom: (id) => `user:${id}`,
  getConversationRoom: (conId) => `conversation:${conId}`
}

module.exports = utils;