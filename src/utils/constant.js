const SocketEvent = {
  JoinRoom: 'join-room',
  FriendRequest: 'friend-request',
  MessageSent: 'message-sent',
  MessageReceived: 'message-receive',
  SentMessageFail: 'error-sent-message',
  NewConversation: 'new-conversation',
  AcceptRequest: 'accept-request',
  Typing: 'typing',
  EndTyping: 'end-typing',
  Disconnect: 'disconnect',
  UpdateOnlineState: 'update-online-state'


}

const RequestState = {
  Pending: 'pending',
  Accepted: 'accepted'
}

const AccountState = {
  Pending: 'pending',
  Active: 'active'
}

const OnlineState = {
  Online: 'online',
  Offline: 'offline'
}


module.exports = {SocketEvent, RequestState, AccountState, OnlineState};