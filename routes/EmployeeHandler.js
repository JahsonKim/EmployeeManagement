var express = require('express');
var router = express.Router();
var async = require('async');
var con = require('../connect');
var auth=require('../auth');


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
                   var o=JSON.parse(JSON.stringify(data));
                    done(error, o);
                });
            },
            function(projects,done){
                var query= "SELECT * FROM tasks";
                con.query(query, function(error,data){
                   var s= JSON.parse(JSON.stringify(data));
                    done(error, s, projects);
                });
            },
            function(tasks,projects,done){
                var query= "SELECT E.employeeName,S.title,T.date_assigned from employees E join assignedTasks T on E.employeeId=T.employeeId join tasks S on S.taskId=T.taskId WHERE S.due_date>=now()";
                con.query(query, function(error,data){
                  var n= JSON.parse(JSON.stringify(data));
                    done(error,n,tasks,projects);
                });
            },
            function(going,tasks,projects,done){
                var query="SELECT E.employeeName,D.departmentName,S.title,S.due_date FROM employees E join departments D on D.departmentId=E.departmentId join assignedtasks T on E.employeeId=T.employeeId join tasks S on S.taskId=T.taskId WHERE S.due_date<=now() order by D.departmentName ";
                con.query(query, function(error,data){    
                 var c= JSON.parse(JSON.stringify(data));
                    done(error,c,going,tasks,projects);
                });
            }
        ], function(err,c,going,tasks, projects){

            if(err){
                console.log(err)
                return
            }
            
                res.render('project',{
                    projectData:projects,
                    taskData:tasks,
                    ongoingData:going,
                    completedData: c
                });
            
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
            // response.send({title:'sucessfully added'});
        });
        response.render('index');
    });
    // for user authentication registration
    router.post('/register',(req,res)=>{
        var employeeId = req.body.employeeId;
        var username = req.body.username;
        var email = req.body.email;
        var pswd = req.body.pswd;
        // console.log(req.body);
        var query ='INSERT INTO auth (employeeId,username,email,pswd) VALUES("'+ employeeId +'","'+ username +'","'+ email +'","'+ pswd +'")'

        con.query(query, (error, result)=>{
            if(error) throw error;
            console.log("registered successfully")
        });
        res.render('index');
    });
    // for session login
    router.post('/login',(req,res)=>{
        var email = req.body.email;
        var pswd = req.body.pswd;
        con.query('SELECT email,pswd FROM auth where email=? and pswd=?',[email,pswd],(error,result,fields)=>{
            if(result)
            {
                res.redirect('project');
                
            }
            else{
                res.render('index');
            }
            res.end();
        });
        
    });

}

new EmployeeHandler().attach(router);
module["exports"] = router;