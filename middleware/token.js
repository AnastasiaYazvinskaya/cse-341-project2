const jwt = require('jsonwebtoken');

const protectedToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401); //отсутствует
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); //недействителен
      req.user = user;
      console.log('token.user', req.user);
      next();
  });
};

const getToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!!token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!!err) {
        req.user = user;
        console.log('token.user', req.user);
      }
    });
  }
  next();
};

module.exports = { protectedToken, getToken }