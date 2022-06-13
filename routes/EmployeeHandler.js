var express = require('express');
var router = express.Router();
var async = require('async');
var con = require('../connect');



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
    router.get('/project', function(req,res) {
        async.waterfall([
            function(done){
                var query="SELECT* FROM projects";
                con.query(query, function(error,data){
                    o=JSON.parse(JSON.stringify(data));
                    done(error, o);
                });
            },
            function(projects,done){
                var query= "SELECT * FROM tasks";
                con.query(query, function(error,data){
                    s=JSON.parse(JSON.stringify(data));
                    done(error, s, projects);
                });
            }
        ], function(err,s, projects){

            if(err){
                console.log(err)
                return
            }
            else{
                res.render('project',{projectData:projects,taskData:s})
            }
        });
        
        
    });
    router.get('/payroll',function(req,res){
        var query="SELECT * FROM payroll";
        con.query(query, function(error,data){
            var a=JSON.parse(JSON.stringify(data));
            if(error)
            {
                throw error;
            }
            else
            {
                res.render('payroll',{payrollData:a});
            }
        });
        
    });
    router.get('/new-Employee', function (request, response) {
        response.render('new-Employee');
    });
    // posting data of new employee in the database
    router.post('/Addnew', function (request, response) {

        var employeeId = request.body.employeeId;
        var employeeName = request.body.employeeName;
        var ssn_number = request.body.ssn_number;
        var email = request.body.email;
        var phone_number = request.body.phone_number;
        var manager = request.body.manager;
        var roleId = request.body.roleId;
        var departmentId = request.body.departmentId;
        // console.log(request.body);
        var query = 'INSERT INTO employees (employeeId,employeeName,ssn_number,email,phone_number,manager,roleId,departmentId) VALUES("' + employeeId + '","' + employeeName + '","' + ssn_number + '","' + email + '","' + phone_number + '","' + manager + '","' + roleId + '","' + departmentId + '")';
        // console.log(query);
        con.query(query, function (error, result) {
            if (error) throw error;
            console.log("inserted successfully")

        });
        response.render('new-Employee');
    });
    router.get('/employees', function (request, response) {

        async.waterfall([
                function (done) {
                    // for displaying departments data
                    var query = "SELECT departmentId,departmentName FROM departments";
                    con.query(query, function (error, data) {
                        p = JSON.parse(JSON.stringify(data));
                        done(error, p)

                    });
                },
                function (departments, done) {
                    // for displaying managers
                    var query = "SELECT D.departmentName,E.manager FROM departments D join employees E on D.departmentId=E.departmentId group by D.departmentId limit 3"
                    // for displaying employees data
                    con.query(query, function (error, data) {
                        var t = JSON.parse(JSON.stringify(data));
                        done(error, t, departments)

                    });
                },
                function(managers,departments,done){
                    var query ="SELECT* FROM roles";
                    con.query(query,function(error,data){
                        var r=JSON.parse(JSON.stringify(data));

                        done(error, r, managers,departments)
                    });
                },
                function (roles, managers, departments, done) {
                    var query = "SELECT* FROM employees";
                    con.query(query, function (error, data) {
                        // it is arranged correspondingly acoording to the order
                        var d = JSON.parse(JSON.stringify(data));

                        done(error, d, roles, managers,departments)

                    });
                }
                ] ,  function (err, d,roles, managers,departments) {

                    if(err){
                        console.log(err)
                        return
                    }
                    

                //render page
                response.render('employees', {
                    departmentData: departments,
                    managerData: managers,
                    rolesData:roles,
                    employeeData: d
                });
            })





    });
    

}

new EmployeeHandler().attach(router);
module["exports"] = router;