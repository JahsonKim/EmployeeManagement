var express = require('express');
var router = express.Router();


var EmployeeHandler = function () {

}
EmployeeHandler.prototype.attach = function (router) {

    var self = this;
    /***
     *  start of  employee-list
     * This is a get route for employees list
     * */

    router.get('/employee-list', function (request, response) {
        /****
         * TODO
         * Get the employee data from the database here
         * return the data to the view in the statement below
         */


        response.render('index', {
            /* return employee data here to the page */
        });
    });

    /**
     * end of  employee-list
    */



    /***
     * Other routes under employees will go below here
     */
 router.get('/employee-new', function (request, response) { 
        response.render('index', {
            
        });
    });



}

new EmployeeHandler().attach(router);
module["exports"] = router;