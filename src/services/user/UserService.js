const UserModel = require("./UserModel");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {AccountState} = require("../../utils/Constant");
const RequestModel = require("../request/RequestModel");
const {DateTime} = require("luxon");
const {RequestState} = require("../../utils/constant");
const ConversationModel = require("../conversation/ConversationModel");
const utils = require("../../utils/utils");


class UserService {
  async getUser(id, populate) {
    const defaultPopulate = {username: 1, fullName: 1}
    const user = await UserModel.findOne(
      {_id: id},
      {...defaultPopulate, ...populate})
      .lean();

    return user;
  }

  async login(username, password) {
    const user = await UserModel.findOne({username});
    if (!user) {
      throw Error('User not found');
    }

    if (user.state !== AccountState.Active) {
      throw Error('Your account is temporary pending. Please wait for approval from our admin');
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    );
    if (!passwordIsValid) {
      throw Error("Invalid username or password");
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    })

    return {
      _id: user._id,
      accessToken: token,
      fullName: user.fullName,
      avatar: user.avatar
    }
  }

  async createFriendRequest({from, to, message}) {
    if (from === to) {
      throw Error('Invalid request, Can not send request to same person');
    }

    const users = await UserModel.find(
      {
        _id: {$in: [from, to]},
        state: {$eq: AccountState.Active}
      }).lean();

    if (users.length !== 2) {
      throw Error("User does not existed");
    }
    let check = await RequestModel.findOne({
      from, to,
      state: {$in: [RequestState.Pending, RequestState.Accepted]}
    });

    if (check) {
      throw Error("Friend request exited");
    }

    let requestData = {
      from, to, message,
      ...{
        date: DateTime.now(),
        state: RequestState.Pending
      }
    };

    const request = await RequestModel.create(requestData);

    const data =
      await RequestModel.populate(request, {path: 'from', select: {avatar: 1, fullName: 1}});

    return data;
  }

  async getRoomsForUser(userId) {
    const userRoom = utils.getNotiUserRoom(userId);
    const conversationRoom = (await ConversationModel.find({
      participants: {
        $elemMatch: {$eq: userId}
      }
    })).map(con => utils.getConversationRoom(con._id.toString()));

    return [userRoom, ...conversationRoom];
  }


  async verifyToken(token) {
    if (!token) {
      throw Error('No token provided');
    }
    const jwtsecret = process.env.JWT_SECRET;
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtsecret, (err, decoded) => {
        if (err) {
          reject(err);
        }

        resolve(decoded);
      })
    });
  }
}

module.exports = {UserService: new UserService()}