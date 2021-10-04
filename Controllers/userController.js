const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const util = require("../utils");
const jwt = require("jsonwebtoken");
const dbConnect = require("../SqlConfig/config.db");
///////////////////////////////////////////////////////////////////////////////////////////
//getUserByID.//
exports.getUserByID = (req, res) => {
    User.getUserByID(req.params.id, (err, user) => {
        if(err){
            res.send(err);
            console.log("Single User Data", user);
            res.send(user);
        }
    });
};
/////////////////////////////////////////////////////////////////////////////////////////////
