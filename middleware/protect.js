const jwt = require('jsonwebtoken');
const config = require('../config');
const UserModel = require('../models/userModel');

module.exports = async (req, res, next) => {
  let token;
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers && req.headers.authorization) {
    token = req.headers.authorization;
  }

  if (!token) {
    return res.status(401).send({
      error: 'You are not logged in! please log in to get access',
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    if (!decoded) {
      return res.status(401).send({
        error: 'Unauthorized',
      });
    }

    const user = await UserModel.findOne(
      { uuid: decoded.uuid },
      { _id: 1, fullName: 1, email: 1, uuid: 1 }
    ).lean();

    if (!user) {
      return res.status(401).send({
        error:
          'User belonging to this token does no longer exist, please login again',
      });
    }

    req.user = { ...user };
    res.locals.user = { ...req.user };
    next();
  } catch (err) {
    return res.status(401).send({ error: err.toString() });
  }
};
