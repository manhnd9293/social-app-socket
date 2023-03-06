const SocketEvent = {
  JoinRoom: 'join-room',
  FriendRequest: 'friend-request',
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