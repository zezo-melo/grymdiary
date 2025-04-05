// middleware/verifyToken.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
require("dotenv").config();


function verifyToken(req, res, next) {
  const authHeader = req.headers?.authorization;
  const token = authHeader?.split(" ")[1];

  // console.log("Token recebido:", token); // 
  // console.log("JWT_SECRET usado:", JWT_SECRET); // 


  if (!token) return res.status(401).json({ message: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token inválido" });
  }
}

module.exports = verifyToken;
