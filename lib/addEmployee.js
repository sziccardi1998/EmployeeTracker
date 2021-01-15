const inquirer = require('inquirer');

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the first name of this employee?',
            name: 'employeeFirstName'
        },
        {
            type: 'input',
            message: 'What is the last name of this employee?',
            name: 'employeeLastName'
        },
        {
            type: 'list',
            message: 'What is the role of this employee?',
            //choices: ,
            name: 'employeeRole'
        },
        {
            type: 'list',
            message: 'Who is the manager of this employee?',
            //choices: // something
            //name: 'employeeManager',
        }
    ]).then((data) => {
        // add the employee to the employee table
        // return to the main menu
    });
}

module.exports = addEmployee;