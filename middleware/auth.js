const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization-Flame');
  let token;
  let tokenIsValid = false;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (token) {
    try {
      // jsonwebtoken v9 requires explicit algorithms option to prevent algorithm confusion attacks
      jwt.verify(token, process.env.SECRET, { algorithms: ['HS256'] });
      tokenIsValid = true;
    } catch (error) {
      tokenIsValid = false;
    }
  }

  req.isAuthenticated = tokenIsValid;

  next();
};

module.exports = auth;
