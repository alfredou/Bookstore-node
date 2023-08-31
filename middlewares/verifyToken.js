const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Obtener el token de autenticación de la cookie
  const token = req.cookies.access_token;
  //console.log("token", token)
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    //req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken