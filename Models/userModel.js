const dbConnect = require("../SqlConfig/config.db");
////////////////////////////////////////////////////////////////////////////////
class User {
    constructor(user){
    this.user_email = user.user_email;
    this.user_password = user.user_password;
  }

}
///////////////////////////////////////////////////////////////////////////////
//SQL db getUserByID.//
User.getUserByID = (id, result) =>{
    dbConnect.query('Select * From users Where user_id=?', id, (error, res) => {
        if(error){
            console.log("Error fetching userby id", error);
            result(null, res);
        }else{
            console.log("User fetched successfully");
            result(null, res);
        }
    });   
};
//////////////////////////////////////////////////////////////////////////////
module.exports = User;