const SocketEvent = {
  JoinRoom: 'join-room',
  FriendRequest: 'friend-request',
}

const RequestState = {
  Pending: 'pending',
  Accepted: 'accepted'
}

module.exports = {SocketEvent, RequestState};