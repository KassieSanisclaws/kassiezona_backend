const User = require("../Models/userModel.js");
const bcrypt = require("bcryptjs");
const util  = require("../utils.js");
const jwt = require("jsonwebtoken");
const dbConnect = require("../SqlConfig/config.db"); 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//createNewUser.//
exports.createNewUser = (req, res) => {
//TEST-CASE[1]: (construct constant of variables from form).//
//Destructured variable constant below for less declarations of the same variables.//
 const {user_name, user_email, user_password, user_confirmPassword } = new User({
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_password: req.body.user_password,
        user_confirmPassword: req.body.user_confirmPassword
    });
//TEST-CASE[2]: (if statment checking each input field).//(WORKING)
//Checking All Input Fields Of Empty Data Being submitted Into DataBase.//
    if(user_name == req.body.user_name < 0){
        res.status(400).json({ success: false, message: "Name Field Must Be Completed Before Submitting!" }); 
       }else{
    if(user_email == req.body.user_email < 0){
      res.status(400).json({ success: false, message: "Email Field Must Be Completed Before Submitting!" });
       }else{
    if(user_password == req.body.user_password < 0){
      res.status(400).json({ success: false, message: "Password Field Must Be Completed Before Submitting!" });
      console.log(user_password);
       }else
    if(user_confirmPassword == req.body.user_confirmPassword < 0){
      res.status(400).json({ success: false, message: "ConfirmPassword Field Must Be Completed Before Submitting!" });
      console.log(user_confirmPassword);
    }
//TEST-CASE[3]: (SQL Query).//(WORKING)
//Do Sql Query of email checking if there is already a user with that email in the database.//  
 dbConnect.query("SELECT * FROM `users` WHERE user_email = ?",[user_email], (err, reqDataResult) => {
    if(err){ 
      res.status(500).json({ success: false, message: "An Error Occured While Creating User" });
      }else{
    if(reqDataResult.length > 1){
      res.status(401).json({ success: false, message: "User Email Already In Use! "});
      console.log(reqDataResult)
      }else{
    if(reqDataResult.length == 0){
//TEST-CASE[4]:(Bcrypt Code).//(WORKING)
//Bcrypt Code Block Runs Generating The Hash Of The Password An Saulting Rounds.//        
 bcrypt.hash("user_password", 10, (err, hash) => {
    if(err){
      res.status(500).json({ success: false, message: "Error Occured Creating User!." });
      console.log(err);
      }else{
    if(hash){
//TEST-CASE[5]:(SQL Query INSERT INTO users table).//()
//SQL Query INSERT INTO DB All Fields From Registration Form Into DB Columns.//
 dbConnect.query("INSERT INTO `users` (user_name, user_email, user_password) VALUES (?,?,?)", [user_name, user_email, hash ], (err, reqDataResult) => { 
    if(err){
      res.status(500).json({ success: false, message: "Error Occured Inserting User!" });
      console.log(err);
    }else if(reqDataResult){
      res.status(201).json({ success: true, message: "User Created Successfully!" });
      console.log(reqDataResult);
      }})
    }
  }})      
}
}}})
}}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//loginUser.//
exports.loginUser = (req, res) => {
    const { email, password } = req.body;
//(1st)TestCase: Check The Email And Password Fields FOr Empty Submission.//
   if(email & password == 0){
      res.send(400).json({ success: false, message: "Please Complete All Field Before Submission" });
   }else{
//(2nd)TestCase: Connect To SQL Db Query Config.//
   dbConnect.query("SELECT * FROM users WHERE user_email = ? ", [req.body.email], (err, result) => {
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////