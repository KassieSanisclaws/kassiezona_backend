const jwt = require("jsonwebtoken");

module.exports = generateToken = (user) => {
    return jwt.sign({
        _id: user.id,
        email: user.email,
        password: user.password    
   },
   process.env.JWT_SECRET || process.env.JWT_SECRET,
   {
       expiresIn: "30d",
   }
  );
};