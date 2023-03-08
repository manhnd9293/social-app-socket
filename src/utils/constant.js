const SocketEvent = {
  JoinRoom: 'join-room',
  FriendRequest: 'friend-request',
  MessageSent: 'message-sent',
  MessageReceived: 'message-receive',
  SentMessageFail: 'error-sent-message'
}

const RequestState = {
  Pending: 'pending',
  Accepted: 'accepted'
}

const AccountState = {
  Pending: 'pending',
  Active: 'active'
}


module.exports = {SocketEvent, RequestState, AccountState};