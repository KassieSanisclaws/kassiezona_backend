const User = require("../Models/userModel.js");
const bcryptjs = require("bcryptjs");
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
       }else
    if(user_confirmPassword == req.body.user_confirmPassword < 0){
      res.status(400).json({ success: false, message: "ConfirmPassword Field Must Be Completed Before Submitting!" });
    }
//TEST-CASE[3]: (SQL Query).//(WORKING)
//Do Sql Query of email checking if there is already a user with that email in the database.//  
 dbConnect.query("SELECT * FROM `users` WHERE user_email = ?",[user_email], (err, reqDataResult) => {
    if(err){ 
      res.status(500).json({ success: false, message: "An Error Occured While Creating User" });
      }else{
//TEST-CASE[4]: (if statement).//(WORKING)
//Checks If User Already in DataBase.//
    if(reqDataResult.length == 1){
      res.status(401).json({ success: false, message: "User Email Already In Use! "});
      }else{
    if(reqDataResult.length == 0){
//TEST-CASE[5]:(Bcrypt Code).//(WORKING)
//Bcrypt Code Block Runs Generating The Hash Of The Password An Saulting Rounds.//        
 bcryptjs.hash(user_password, 10, (err, hash) => {
    if(err){
      res.status(500).json({ success: false, message: "Error Occured Creating User!." });
      }else{
    if(hash){
//TEST-CASE[6]:(SQL Query INSERT INTO users table).//(WORKING)
//SQL Query INSERT INTO DB All Fields From Registration Form Into DB Columns.//
 dbConnect.query("INSERT INTO `users` (user_name, user_email, user_password) VALUES (?,?,?)", [user_name, user_email, hash ], (err, reqDataResult) => { 
    if(err){
      res.status(500).json({ success: false, message: "Error Occured Inserting User!" });
    }else if(reqDataResult){
      res.status(201).send({ success: true, authToken: generateToken({ user: user_email })});  
      }
    })
    }
  }})         
}
}}})
}}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//loginUser.//
exports.loginUser = (req, res) => {
//TEST-CASE[1]:(Variables)-deconstruct.//(WORKING)
//De-construct variables to hold the req.body and can be called within the code easily.//
  const { user_email, user_password } = {
        user_email: req.body.user_email,
        user_password: req.body.user_password };
//TEST-CASE[2]:(if statement).//(WORKING)
//If Statement checking user_email and user-password fields before submission.//
  if(user_email == req.body.user_email < 0){
       res.status(400).json({ success: false, message: "Must Have Email Field Complete Before Submitting!" });
       }else{
  if(user_password == req.body.user_password < 0){
       res.status(400).json({ success: false, message: "Must Have Password Field Completed Before Submitting!." });
       }else{
//TEST-CASE[3]:(SQL Query).//(WORKING)
//Sql Query Checking The DataBase By user_email Returning (err, results from search).//
 dbConnect.query("SELECT * FROM `users` WHERE user_email = ?", [user_email], (err, reqResult) => {
    if(err){
       res.status(500).json({ success: false, message: "Error Occured Perfoming Request!" });
       }else{
//TEST-CASE[4]:(is statement).//(WORKING)
//If Statement Checking For A User By user_email in DataBase Returning False If No User Is Found By user_email.//
    if(reqResult.length == 0){
      res.status(401).json({ success: false, message: "User Not Found!" });
    }else{
//TEST-CASE[5]:(Bcrypt).//(WORKING)
//Bcrypt Comparing Password Fopr Validation./// 
 bcryptjs.compare(user_password, reqResult[0].user_password, (err, result) => {
    if(err){
      console.log(err);
      res.status(500).json({ success: false, message: "Error Occured Validating!" });
    }else{
//TEST-CASE[6]:(if statement).//(WORKING)
//If Statement Returing Response Of Successful logIn.//
      if(result){
        res.status(200).send({ success: true, authToken: generateToken({ user: user_email })});
      }else{
        res.status(401).send({ success: false, message: "Password Incorrect!"});
      }
    }})
  }}})
}}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
