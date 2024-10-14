const jwt = require('jsonwebtoken');
const {UserService} = require("../services/user/UserService");

const isApiServer = async (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({message: "No token provided!"});
  }
  const jwtSecret = process.env.JWT_SECRET;
  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({message: "Fail to authenticate user!"});
    }
    const userId = decoded.id;
    const user = await UserService.getUser(userId);
    if (user.username !== 'api-server') {
      return res.status(401).send({message: 'Not allow to post'});
    }
    next();
  });
};

module.exports = {
  isApiServer
};