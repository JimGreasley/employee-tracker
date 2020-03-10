//const Employee = require("./lib/Employee");
//const Manager = require("./lib/Manager");
//const Engineer = require("./lib/Engineer");
//const Intern = require("./lib/Intern");

const inquirer = require("inquirer");
//const path = require("path");
//const fs = require("fs");

//const OUTPUT_DIR = path.resolve(__dirname, "output");
//const outputPath = path.join(OUTPUT_DIR, "team.html");

const mysql = require("mysql");

//-----------------------------------------------------------------
// define the server connection
//-----------------------------------------------------------------
const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "employee_db"
});


// const addEmplQuestions = [
//     {
//       type: "input",
//       message: "What is the new employee's first name?",
//       name: "emplFirstName"
//     },
//     {
//     type: "input",
//     message: "What is the new employee's last name?",
//     name: "emplLastName"
//     },
//     {
//       type: "input",
//       message: "What is the new employee's role?",
//       name: "emplRole"
//     },
//     {
//       type: "input",
//       message: "Who is the new employee's manager?",
//       name: "emplManager"
//     }
// ];
  
// const addRoleQuestions = [
//     {
//       type: "input",
//       message: "What is the title of the new role?",
//       name: "roleTitle"
//     },
//     {
//       type: "input",
//       message: "What is the salary of the new role?",
//       name: "roleSalary"
//     },
//     {
//       type: "input",
//       message: "To which department does the new role belong?",
//       name: "roleDept"
//     }
// ];
  
// const addDeptQuestions = [
//     {
//       type: "input",
//       message: "What is the new department's name?",
//       name: "deptName"
//     }
// ];
    
const businessOwnerAction = {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View all employees',
              'View all roles',
              'View all departments',
              'Add employee',
              'Add role',
              'Add department',
              'Update employee role',
              'Delete employee',
              'Exit']
};

//-----------------------------------------------------------------
// establish connection with server
//-----------------------------------------------------------------
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  main();
});

//-----------------------------------------------------------------
// main process loop
// - prompt business owner for action they'd like to perform
// - call function to perform selected action
// - repeat until they're finished
//-----------------------------------------------------------------
function main() {
    inquirer
      .prompt(businessOwnerAction)
      .then(function(selection) {
        //
        // based on business owner's answer, perform the corresponding functions
        //
        switch (selection.action) {
          case 'View all employees':
              viewAllEmployees();
              break;
          case 'View all roles':
              viewAllRoles();
              break;
          case 'View all departments':
              viewAllDepartments();
              break;
          case 'Add employee':
              addEmployee();
              break;
          case 'Add role':
              addRole();
              break;
          case 'Add department':
              addDepartment();
              break;
          case 'Update employee role':
              updateEmployeeRole();
              break;
          case 'Delete employee':
              deleteEmployee();
              break;
          default:
              connection.end();
        }
      });
  }
// if (selection.action === 'View all employees') {
//     viewAllEmployees();
// }
// else if(selection.action === 'View all roles') {
//     viewAllRoles();
// }
// else if(selection.action === 'View all departments') {
//     viewAllDepartments();
// }
// else if(selection.action === 'Add employee') {
//     addEmployee();
// }
// else if(selection.action === 'Add role') {
//     addRole();
// }
// else if(selection.action === 'Add department') {
//     addDepartment();
// }
// else if(selection.action === 'Update employee roles') {
//     updateEmployeeRole();
// }
// else if(selection.action === 'Delete employee') {
//     deleteEmployee();
// } else{
// connection.end();
// }


function viewAllEmployees() {
  connection.query
    ("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.dept_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
      function(err, res) { 
        if (err) throw err;
        console.table(res);
        main();
      }) 
  //  ("SELECT * FROM employee", function(err, res) { 
}


function viewAllRoles() {
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      console.table(res);
      main();
    });         
}

function viewAllDepartments() {
    connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;
      console.table(res);
      main();
    });
}


function addDepartment() {
    inquirer
     .prompt([
        {
          type: "input",
          message: "What is the new department's name?",
          name: "deptName"
        }
     ])
     .then(function(res) {
        connection.query("INSERT INTO department SET ?", { name: res.deptName },
            function(err) {
            if (err) throw err;
            // console.table(res);
            main();
        });
     });
}


function addRole() {
    //
    // get all departments available from database
    //
    connection.query("SELECT * FROM department", function(err, results) {
      if (err) throw err;
      inquirer
        .prompt([
            {
            type: "input",
            message: "What is the title of the new role?",
            name: "roleTitle"
            },
            {
            type: "input",
            message: "What is the salary of the new role?",
            name: "roleSalary"
            },
            {
            // prompt the user for which department the new role belongs to
            name: "roleDept",
            type: "rawlist",
            choices: function() {
                var deptArray = [];
                for (var i = 0; i < results.length; i++) {
                deptArray.push(results[i].name);
                }
                return deptArray;
            },
            message: "To which department does the new role belong?"
            }
        ])
        .then(function(answers) {
            var chosenDept;
            // capture new role's department id based department name
            for (var i = 0; i < results.length; i++) {
              if (results[i].name === answers.roleDept) {
                chosenDept = results[i];
              }
            }
            connection.query("INSERT INTO role SET ?",
                {
                  title: answers.roleTitle,
                  salary: answers.roleSalary,
                  dept_id: chosenDept.id
                },
            function(err) {
                if (err) throw err;
                // console.table(res);
                main();
            })
        });
    });
}


function addEmployee() {
    //
    // prompt user for new employee's first and last names
    //
    inquirer
        .prompt([
            {
            name: "firstName",
            type: "input",
            message: "What is the new employee's first name?"
            },
            {
            name: "lastName",
            type: "input",
            message: "What is the new employee's last name?"
            }
        ])
        .then(function(answers) {
            // now get new employee's title(role) and pass along names
            getEmplRole(answers.firstName, answers.lastName)          
        });
}


function getEmplRole(emplFirstName, emplLastName) {
    //
    // get all id's and titles from role database
    //
    connection.query("SELECT id, title FROM role", function(err, results) {
      if (err) throw err;
      inquirer
        .prompt([
          // prompt the user for new employee's title
            {
              name: "emplRole",
              type: "rawlist",
              choices: function() {
                  var roleArray = [];
                  for (var i = 0; i < results.length; i++) {
                    roleArray.push(results[i].title);
                  }
                  return roleArray;
              },
              message: "What is the new employee's role?"
            }
        ])
        .then(function(answers) {
            var chosenRole;
            // capture new employee's role id based on title
            for (var i = 0; i < results.length; i++) {
              if (results[i].title === answers.emplRole) {
                chosenRole = results[i];
              }
            }
            // now get the new employee's manager - name pass along names and role id
            getEmplManager(emplFirstName, emplLastName, chosenRole.id)   

        });
    });
}


function getEmplManager(firstName, lastName, roleId) {
  //
  // get all manager id's and full names from the employee database
  //
  connection.query("SELECT DISTINCT employee.manager_id, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager_Name FROM employee LEFT JOIN employee AS manager on manager.id = employee.manager_id WHERE employee.manager_id IS NOT NULL", function(err, results) {
    if (err) throw err;
    inquirer
       .prompt([
           {
           // prompt the user for the new employee's manager
           name: "emplManager",
           type: "rawlist",
           choices: function() {
              var mgrArray = [];
              for (var i = 0; i < results.length; i++) {
                mgrArray.push(results[i].Manager_Name);
              }
              mgrArray.push("None");
              return mgrArray;
           },
           message: "Who is the new employee's manager?"
           }
       ])
       .then(function(answers) {
           var chosenMgrId;
           // capture the manager's id, if one, else assign NULL 
           for (var i = 0; i < results.length; i++) {
              if (answers.emplManager === "None") {
                chosenMgrId = null;
              } else if (answers.emplManager === results[i].Manager_Name) {
                chosenMgrId = results[i].manager_id;
              }
           }
           // finsally create the new employee record
           connection.query("INSERT INTO employee SET ?",
            {
              first_name: firstName,
              last_name: lastName,
              role_id: roleId,
              manager_id: chosenMgrId
            },
            function(err) {
              if (err) throw err;
              // console.table(res);
              main();
           })
       });
   });
}

// ("SELECT first_name AS 'First Name', last_name AS 'Last Name', title AS Title, department.name AS Department, salary AS Salary, manager_name as Manager FROM (((employee LEFT JOIN role ON employee.role_id = role.id) LEFT JOIN department ON role.dept_id = department.id) LEFT JOIN manager ON employee.manager_id = manager.id) ORDER BY last_name",

// ("CREATE TEMPORARY TABLE manager SELECT DISTINCT T1.id, CONCAT(T1.first_name, ' ', T1.last_name) AS 'Manager Name' FROM employee T1, employee T2 WHERE T1.id = T2.manager_id",
// function(err, res) { 

function updateEmployeeRole() {
  //
  // list all employee id's and names from the employee database so user may select which one to update 
  //
  connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name FROM employee", function(err, results) {
    if (err) throw err;
    inquirer
       .prompt([
           {
           // prompt the user for the employee whose role needs to be updated
           name: "emplToUpdate",
           type: "rawlist",
           choices: function() {
              var emplArray = [];
              for (var i = 0; i < results.length; i++) {
                emplArray.push(results[i].employee_name);
              }
              //emplArray.push("None");
              return emplArray;
           },
           message: "Which employee's role needs to be updated?"
           }
       ])
       .then(function(answers) {
           var chosenEmplId;
           // capture the employee's id that needs their role updated 
           for (var i = 0; i < results.length; i++) {
              if (answers.emplToUpdate === results[i].employee_name) {
                chosenEmplId = results[i].id;
              }
           }
          // now list all roles from whcih the employee's new role will be chosen
          getEmplNewRole(chosenEmplId)  
       });
   });

}

function getEmplNewRole(employeeId) {
  //
  // get all id's and titles from role database so user may select the employee's new title (role)
  //
  connection.query("SELECT id, title FROM role", function(err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        // prompt the user for employee's new title (role)
          {
            name: "emplNewRole",
            type: "rawlist",
            choices: function() {
                var roleArray = [];
                for (var i = 0; i < results.length; i++) {
                  roleArray.push(results[i].title);
                }
                return roleArray;
            },
            message: "What is the employee's new role?"
          }
      ])
      .then(function(answers) {
          var chosenRoleId;
          // capture employee's new role id based on title
          for (var i = 0; i < results.length; i++) {
            if (results[i].title === answers.emplNewRole) {
              chosenRoleId = results[i].id;
            }
          }
           // finally update the employee record with employee's new role
           connection.query("UPDATE employee SET ? WHERE ?",
            [
              {
               role_id: chosenRoleId,
              },
              {
               id: employeeId
              }
            ],
            function(err) {
              if (err) throw err;
              // console.table(res);
              main();
           })
      });
  });
}


function deleteEmployee() {
  //
  // list all employee id's and names from the employee database so user may select which one to delete 
  //
  connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name FROM employee", function(err, results) {
    if (err) throw err;
    inquirer
       .prompt([
           {
           // prompt the user for the employee to be deleted
           name: "emplToDelete",
           type: "rawlist",
           choices: function() {
              var emplArray = [];
              for (var i = 0; i < results.length; i++) {
                emplArray.push(results[i].employee_name);
              }
              //emplArray.push("None");
              return emplArray;
           },
           message: "Which employee is to be deleted?"
           }
       ])
       .then(function(answers) {
           var chosenEmplId;
           // capture the employee's id that needs their role updated 
           for (var i = 0; i < results.length; i++) {
              if (answers.emplToDelete === results[i].employee_name) {
                chosenEmplId = results[i].id;
              }
           }
           // delete the chosen employee from the employee table
          connection.query("DELETE FROM employee WHERE ?",
           {
              id: chosenEmplId
           },
          function(err) {
            if (err) throw err;
            // console.table(res);
            main();
        }) 
       });
   });
}