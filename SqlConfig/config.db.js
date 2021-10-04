const mysql2 = require("mysql2");
const dotenv = require("dotenv");
////////////////////////////////////////////////////////////////
dotenv.config();

const dbConnect = mysql2.createConnection({
    host     : process.env.HOST,
    user     : process.env.USER,
    database : process.env.MYSQL_DB,
    password : process.env.PASSWORD,  
    port     : process.env.DB_PORT
});
////////////////////////////////////////////////////////////////
//connection string path for sql database.//
dbConnect.connect(function(error) {
    if(error) throw error; {
    console.log("My SQL Databse Connected Successfully!"); 
    }
});
////////////////////////////////////////////////////////////////
module.exports = dbConnect;