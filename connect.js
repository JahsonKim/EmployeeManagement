var mysql = require('mysql');

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Brighton5636@",
    database:"work"
});

con.connect(function(err){
    if(err)throw err;
    console.log("connected!")
});
module.exports=con;