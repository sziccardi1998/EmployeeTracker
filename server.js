const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: // figure out how to hide this later
    database: //whatever we name this thing later
});

connection.connect(err => {
    if (err) throw err;
    console.log("Conencted as id" + connection.threadId);
    // insert function that starts the cli
});

function optionTree() {
    inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        name: 'selection',
        choices: ['View all employees', 'View department', 'View role', 'Add department', 'Add role', 'Add employee'],
    }]).then((data) => {
        const userChoice = data.selection;
        // build a case-switch tree that performs a different task for each choice
        case(userChoice) {

        }
    })
}