const express = require('express');
var path = require('path');
var bodyParser = require('body-parser'); 
const app = express();  
var router = express.Router();
 
   

const server = app.listen(4589, () => {
    console.log(`Website running → PORT ${server.address().port}`); 
    

});
// This code sets static files such as css and external js which are in the public folder

app.use(express.static(path.join(__dirname, '/public')));
//This line tells the app where the html pages will be found
const viewsPath = path.join(__dirname, '/views');
app.set('view engine', 'ejs');
app.set('views', viewsPath); 

// These two lines allows our application to receive API request with application/json headers or form-urlencoded

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
})); 


//This sets the default route to employee list.
app.get('/', (req, res) => {
    res.redirect('/employee-list'); 
}); 

// This is our first external route in the routes folder
//Other routes will be added here
router.use("/", require('./routes/EmployeeHandler')); 
 

app.use("/", router);