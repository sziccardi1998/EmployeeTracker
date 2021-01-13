const mysql = require("mysql");
const inquirer = require("inquirer");

// import other functions
const addDepartment = require('./lib/addDepartment');
const addEmployee = require('./lib/addEmployee');
const addRole = require('./lib/addRole');
const viewDepartments = require('./lib/viewDepartments');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "", // figure out how to hide this later
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
        choices: ['View all employees', 'View department', 'View role', 'Add department', 'Add role', 'Add employee', 'Exit'],
    }]).then((data) => {
        let userChoice = data.selection;
        // build a case-switch tree that performs a different task for each choice
        // each case should have a function that is used
        switch (userChoice) {
            case 'View all employees':
                break;
            case 'View all departments':
                viewDepartments();
                break;
            case 'View role':
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
