const mysql = require("mysql");
const inquirer = require("inquirer");

// import other functions
const addEmployee = require('./lib/addEmployee');
const addRole = require('./lib/addRole');
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
                    console.log("Department created!\n");
                }
            );
            // return back to the main menu
            optionTree();
        })
}