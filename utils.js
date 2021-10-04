const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
    return jwt.sign({
        _id: user.id,
        email: user.email,    
   },
   process.env.JWT_SECRET || "youWontEve9GuessTHisHerre2021",
   {
       expiresIn: "30d",
   }
  );
};