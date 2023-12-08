const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = {
  isAuthorised: async (req, res, next) => {
    console.log(req.headers);
    try {
      let token = req.headers.Authorization || req.headers.authorization;
      if (token) {
        token = token.substr("Bearer ".length);
        const decoded = await jwt.verify(token, config.jwtSecret);
        if (!decoded) {
          return res.status(401).send("unauthorised not decoded");
        }
        req.decoded = decoded;
        console.log(decoded);
        return next();
      }
      return res.status(401).json({ message: "unauthorised or no token" });
    } catch (error) {
      console.log("\n isAuthorised error...", error);
      return res.status(401).json({ message: "unauthorised error" });
    }
  },
};
