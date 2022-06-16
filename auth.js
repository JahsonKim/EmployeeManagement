const { nextTick } = require("async");

function checkSession(req,res,next){
    if(req.body.user==undefined){
        //redirect to login
    }
    next();
}
