import jwt from "jsonwebtoken";

export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader && authHeader.split(" ")[1];
  if (!bearerToken) {
    res.sendStatus(401);
  } else {
    jwt.verify(bearerToken, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        req.user = user;
        next();
      }
    });
  }
}

export function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
}
