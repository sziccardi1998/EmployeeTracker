const mysql = require("mysql");
const inquirer = require("inquirer");

// import other functions
const addEmployee = require('./lib/addEmployee');
//const addRole = require('./lib/addRole');
const viewDepartments = require('./lib/viewDepartments');
const viewAllEmployees = require('./lib/viewAllEmployees');
const viewRoles = require('./lib/viewRoles');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "Jag!ax22", // figure out how to hide this later
    database: "employeeTracker_DB" //whatever we name this thing later
});

connection.connect(err => {
    if (err) throw err;
    console.log("Conencted as id" + connection.threadId);
    // insert function that starts the cli
    optionTree();
});

function optionTree() {
    inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        name: 'selection',
        choices: ['View all employees', 'View all departments', 'View roles', 'Add department', 'Add role', 'Add employee', 'Exit'],
    }]).then((data) => {
        let userChoice = data.selection;
        // build a case-switch tree that performs a different task for each choice
        // each case should have a function that is used
        switch (userChoice) {
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'View all departments':
                viewDepartments();
                break;
            case 'View roles':
                viewRoles();
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'Add role':
                addRole();
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Exit':
                break;
        }
    })
}

// Begining of functions

// create function that adds a new department to the department table
const addDepartment = () => {
    // prompt for the department name
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the department name?',
            name: 'department'   
        }
    ]).then((data) => {
            // BONUS: check to see if that department already exsists
            var departmentName = data.department;
            // if the department does not exsist add it to the table
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: departmentName
                },
                function(err, res) {
                    if (err) throw err;
                    console.log("\nDepartment created!\n");
                }
            );
            // return back to the main menu
            optionTree();
        })
}

// create a function that adds a new role to the roles database
const addRole = () => {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
                {
                     type: 'input',
                     message: 'What is the title of the role?',
                     name: 'roleTitle'
                },
                {
                     type: 'number',
                     message: 'What is the salary of this role?',
                     name: 'roleSalary'
                },
                {
                     type: 'list',
                     message: 'Which department does this role belong to?',
                     name: 'roleDepartment',
                     choices: function () {
                         let deptArray = res.map(choice => choice.name);
                         return deptArray
                     }
                }
            ]).then((data) => {
        let depID = connection.query(
        "SELECT FROM department WHERE ?",
        {
            name: data.roleDepartment
        },
        function(err, res) {
            if (err) throw err;
            return res.id;
        }
    )
    connection.query(
        "INSERT INTO role SET ?", {
            title: data.roleTitle,
            salary: data.roleSalary,
            department_id: depID
        },
        function(err, res) {
            if (err) throw err;
            console.log("\nRole added!\n");
        }
    )
    })    
    })
    optionTree();
}
    //     // BONUS: check to see if the role already exsists
    //     // if the role does not already exsist add it to the roles table

    //     // get the id of the department that is selected
    //     let depID = connection.query(
    //         "SELECT FROM department WHERE ?",
    //         {
    //             name: data.roleDepartment
    //         },
    //         function(err, res) {
    //             if (err) throw err;
    //             return res.id
    //         }
    //     );

    //     console.log(depID);
    //     // insert the new role into the table
    //     connection.query(
    //         "INSERT INTO role SET?",
    //         {
    //             title: data.roleTitle,
    //             salary: data.roleSalary,
    //             department_id: depID
    //         },
    //         function(err, res) {
    //             if (err) throw err;
    //             console.log("\nRole added!\n")
    //         }
    //     );
        
    //     // return back to the main menu
    //     optionTree();
    // });