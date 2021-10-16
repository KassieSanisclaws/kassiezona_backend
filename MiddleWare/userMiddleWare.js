
module.exports = {
    validateRegister: (req, res, next) => {

//TEST-CASE:[1] (name field min length).//
   if(!req.body.name || req.body.name.length < 3){
       res.status(400).json({ success: false, message: "Name Of User min 5 characters!" });
      }
//TEST-CASE:[2] (email field min length).//
   if(!req.body.email || req.body.email.length < 3){
       res.status(400).json({ success: false, message: "Enter A Valid Email!" });
   }else{
//TEST-CASE:[3] (email field has a @ symbol).//
   if(req.body.email.length === "@"){
       res.status(400).json({ success: false, message: "Enter Valid Email Including @ Symbol!" });
       }
     }
    if(!req.body.password_repeat || req.body.password != req.body.password_repeat){
       res.status(400).json({ success: false, message: "Password & Confirmed Password Does Not Match!" });
    }
   next();
    },
    isLoggedIn: () => {},
};