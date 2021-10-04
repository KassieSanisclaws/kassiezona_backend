const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const util = require("../utils");
const jwt = require("jsonwebtoken");
const dbConnect = require("../SqlConfig/config.db");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//createNewUser.//
exports.createNewUser = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
//(1)TestCase: check the input fields making sure no empty fields are submitted.//
    if(email && password == 0 ){
        res.status(400).json({ success: false, message: "Please Have All Form Fields Completed Before Submission" });
        }else{
//(2nd)TestCase: Check If User Is In Database, Performing A Query.//
   dbConnect.query("Select * From users Where user_email = ?", [req.body.email], (e, result) => {
        if(e){
            res.status(500).json({ success: false, message: "An Error Occured While Creating User" });
         }else{
//(3rd)TestCase: Check DB For A User in Db With This Email, If User Already Exist-Send Back Error Response.//
            if(result.length == 1){
            res.status(401).json({ success: false, message: "User Already In Use " });
         }else{
             if(result.length == 0) {
//(4th)TestCase: Bcrypt Code Block Runs Generating The Hash Of The Password An Saulting Rounds.//
         bcrypt.hash(req.body.password, 10, (e, hash) => {
//(5th)TestCase: Check For Error And If Error Send Back Message Response.//
             if(e){
                 res.status(500).json({ success: false, message: "Error Occured Creating User." });
             }else{
//(6th)TestCase: This Brings The Stored Hash Password Within The Hash Variable. This Now Runs SQL Query Placing The Registered New Created USer Into The DB.//
                 if(hash){
        dbConnect.query("INSERT Into users(user_email, user_password) VALUES (?,?)", [req.body.email, hash], (e, result) => {
            if(e){
                res.status(500).json({ success: false, message: "Error While Creating User" });
            }else{
                if(result){
                    return res.status(201).json({ success: true, message: "User Created Successfully" });
                }
            }})
        }}}
    )}}}
  })}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//loginUser.//
exports.loginUser = (req, res) => {
    const { email, password } = req.body;
//(1st)TestCase: Check The Email And Password Fields FOr Empty Submission.//
   if(email & password == 0){
      res.send(400).json({ success: false, message: "Please Complete All Field Before Submission" });
   }else{
//(2nd)TestCase: Connect To SQL Db Query Config.//
   dbConnect.query("SELECT * FROM users WHERE user_email = ? ", [req.bpdy.email], (err, result) => {
     if(err){
         res.status(500).send("An Error Occured While Verifying User")
     }else{
//(3rd)TestCase: If User  Does Not Exist In SQL DB.//
     if(result.length == 0){
         res.status(401).json({ success: false, message: "User Does Not Exist" });
     }else{
//(4th)TestCase: IF User Is Found Call Bcrpyt To Compare Passsword Entered by User in DB.//
  bcrypt.compare(req.body.password, result[0].user_password, (e, result) => {
      if(e){
          res.status(500).send("An Error Occurred While Verifying The User" );
      }else{
//(5th)TestCase: Compare Generate Result.//
    if(result){
        return res.status(200).send({ succcess: true, authToken: util.generateToken({ user: req.body.email }),
    })
    }else{
//(6th)TestCase: Incorrect Password.//
        return res.status(401).send("The Password Is Incorrect"); 
     }}})
  }}})
 }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////