const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const { sessionbt } = req.cookies;
    console.log('sessioncookie', sessionbt)
    if (!sessionbt) throw new Error('You must be signed in');
    const user = jwt.verify(sessionbt, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    error.status = 401;
    next(error);
  }
};