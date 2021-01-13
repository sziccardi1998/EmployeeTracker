const mysql = require('mysql');
const inquirer = require('inquirer');

// create function to add a department
function addDepartment() {
    // prompt for the department name
    inquirer.prompt([
    {
        type: 'input',
        message: 'What is the department name?',
        name: 'department'   
    }
    ]).then((data) => {
        // BONUS: check to see if that department already exsists

        // if the department does not exsist add it to the table

        // return back to the main menu
    })
}

module.exports = addDepartment;